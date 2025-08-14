
import { NextResponse, type NextRequest } from 'next/server';
import { authenticate } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// DELETE a comment by ID
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const authResult = authenticate(request);
  if (!authResult.authenticated || !authResult.username) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  
  const { id } = await context.params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid comment ID' }, { status: 400 });
  }

  try {
    const { db } = await connectToDatabase();
    
    const comment = await db.collection('comments').findOne({ _id: new ObjectId(id) });
    if (!comment) {
      return NextResponse.json({ message: 'Comment not found' }, { status: 404 });
    }
    
    // Check if the authenticated user is the owner of the comment
    if (comment.userId !== authResult.username) {
        return NextResponse.json({ message: 'Forbidden: You do not own this comment' }, { status: 403 });
    }

    const result = await db.collection('comments').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Comment not found' }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 }); // 204 No Content
  } catch (error) {
    console.error(`Failed to delete comment ${id}:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
