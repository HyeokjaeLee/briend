import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  //! req.body = req.json()
  NextResponse;
  console.log('앱');
  return req.body;
};
