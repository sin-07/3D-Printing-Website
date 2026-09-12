import { NextRequest, NextResponse } from 'next/server';
import cloudinary, { uploadBuffer, isCloudinaryConfigured } from '@/lib/cloudinary';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        { status: 'unconfigured', message: 'Cloudinary credentials missing' },
        { status: 500 }
      );
    }

    const pingResult = await cloudinary.api.ping();
    return NextResponse.json({
      status: 'connected',
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      ping: pingResult,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Cloudinary health check error:', error);
    return NextResponse.json(
      { status: 'error', message: error.message || 'Failed to ping Cloudinary' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        { error: 'Cloudinary is not configured' },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'aetheris_cad';
    const tag = (formData.get('tag') as string) || '3d_printing';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided in form data' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Determine resource type: CAD binary files should use 'raw'
    const fileName = file.name || 'unnamed_file';
    const lowerName = fileName.toLowerCase();
    const isCadFile =
      lowerName.endsWith('.stl') ||
      lowerName.endsWith('.step') ||
      lowerName.endsWith('.stp') ||
      lowerName.endsWith('.obj') ||
      lowerName.endsWith('.3mf') ||
      lowerName.endsWith('.gcode');

    const resource_type = isCadFile ? 'raw' : 'auto';

    // Upload to Cloudinary
    const uploadResult = await uploadBuffer(buffer, {
      folder,
      resource_type,
      tags: [tag, isCadFile ? 'cad_geometry' : 'media'],
      use_filename: true,
      unique_filename: true,
    });

    // Save upload telemetry into MongoDB Atlas
    try {
      const db = await getDatabase();
      await db.collection('uploads').insertOne({
        fileName,
        fileSize: file.size,
        fileType: file.type || (isCadFile ? 'application/octet-stream' : 'image'),
        isCadFile,
        cloudinary: {
          public_id: uploadResult.public_id,
          secure_url: uploadResult.secure_url,
          bytes: uploadResult.bytes,
          format: uploadResult.format || (isCadFile ? fileName.split('.').pop() : ''),
          resource_type: uploadResult.resource_type,
          created_at: uploadResult.created_at,
        },
        uploadedAt: new Date(),
      });
    } catch (dbErr) {
      console.warn('MongoDB upload logging non-blocking error:', dbErr);
    }

    return NextResponse.json(
      {
        success: true,
        fileName,
        fileSize: file.size,
        secure_url: uploadResult.secure_url,
        url: uploadResult.url,
        public_id: uploadResult.public_id,
        resource_type: uploadResult.resource_type,
        bytes: uploadResult.bytes,
        format: uploadResult.format,
        message: 'File successfully uploaded to Cloudinary CDN',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Cloudinary upload endpoint error:', error);
    return NextResponse.json(
      { error: error.message || 'File upload failed' },
      { status: 500 }
    );
  }
}
