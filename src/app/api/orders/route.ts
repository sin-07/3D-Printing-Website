import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customer,
      items,
      pricing,
      payment,
      gstDetails,
      orderNumber,
    } = body;

    if (!customer || !items || !items.length) {
      return NextResponse.json(
        { error: 'Missing required order fields or empty items' },
        { status: 400 }
      );
    }

    const generatedOrderNumber =
      orderNumber || `ATH-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const db = await getDatabase();
    const ordersCollection = db.collection('orders');

    const orderDocument = {
      orderNumber: generatedOrderNumber,
      customer: {
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
        city: customer.city || '',
        state: customer.state || 'Karnataka',
        postalCode: customer.postalCode || '',
        country: customer.country || 'India',
      },
      gstDetails: {
        isGstInvoice: Boolean(gstDetails?.isGstInvoice),
        gstin: gstDetails?.gstin || '',
        companyName: gstDetails?.companyName || '',
        hsnCode: '8477 / 3926',
      },
      items: items.map((item: any) => ({
        productId: item.productId,
        name: item.name,
        image: item.image,
        category: item.category || 'Precision 3D',
        selectedMaterial: item.selectedMaterial || 'Carbon Fiber PA-CF',
        selectedScale: item.selectedScale || '1:1 True Scale',
        customEngraving: item.customEngraving || '',
        unitPrice: item.unitPrice,
        quantity: item.quantity || 1,
      })),
      pricing: {
        subtotal: pricing?.subtotal || 0,
        discountAmount: pricing?.discountAmount || 0,
        crateUpgradeCost: pricing?.crateUpgradeCost || 0,
        isCrateUpgrade: Boolean(pricing?.isCrateUpgrade),
        shippingCost: 0, // Free Pan-India air dispatch
        totalAmount: pricing?.totalAmount || 0,
        currency: pricing?.currency || 'INR',
      },
      payment: {
        method: payment?.method || 'upi',
        upiId: payment?.upiId || '',
        bankName: payment?.bankName || '',
        status: 'authorized',
        gateway: 'Razorpay / UPI Direct Gateway',
        authorizedAt: new Date(),
      },
      logistics: {
        hub: 'BLR-01 (Bengaluru Center of Additive Excellence)',
        alternateHub: 'PNQ-02 (Pune Precision Extrusion Lab)',
        courier: 'BlueDart Apex Air Express',
        serviceType: 'Priority 24-48h Pan-India',
        trackingNumber: `BD-IN-${Math.floor(100000000 + Math.random() * 900000000)}`,
        status: 'queued_for_slicing',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await ordersCollection.insertOne(orderDocument);

    return NextResponse.json(
      {
        success: true,
        orderId: result.insertedId,
        orderNumber: generatedOrderNumber,
        trackingNumber: orderDocument.logistics.trackingNumber,
        message: 'Order recorded in MongoDB Atlas successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Failed to create order in MongoDB:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNumber = searchParams.get('orderNumber');
    const email = searchParams.get('email');

    const db = await getDatabase();
    const ordersCollection = db.collection('orders');

    if (orderNumber) {
      const order = await ordersCollection.findOne({ orderNumber });
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json({ order });
    }

    if (email) {
      const orders = await ordersCollection
        .find({ 'customer.email': email })
        .sort({ createdAt: -1 })
        .toArray();
      return NextResponse.json({ orders });
    }

    // Default: list recent 15 orders
    const recentOrders = await ordersCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(15)
      .toArray();

    return NextResponse.json({
      count: recentOrders.length,
      orders: recentOrders,
    });
  } catch (error: any) {
    console.error('Failed to fetch orders from MongoDB:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
