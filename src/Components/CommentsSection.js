import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faReply, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

const CommentsSection = ({ courseId, lessonId = null, userId }) => {
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');

  // Convex queries
  const comments = useQuery(
    lessonId 
      ? api.comments.getCommentsByLesson 
      : api.comments.getCommentsByCourse,
    lessonId ? { lessonId } : { courseId }
  );

  // Convex mutations
  const createComment = useMutation(api.comments.createComment);
  const updateComment = useMutation(api.comments.updateComment);
  const deleteComment = useMutation(api.comments.deleteComment);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await createComment({
        userId,
        courseId,
        lessonId,
        parentId: replyTo,
        message: newComment.trim()
      });
      
      setNewComment('');
      setReplyTo(null);
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return;

    try {
      await updateComment({
        commentId,
        message: editText.trim()
      });
      
      setEditingComment(null);
      setEditText('');
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment({ commentId });
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  const startEdit = (comment) => {
    setEditingComment(comment._id);
    setEditText(comment.message);
  };

  const cancelEdit = () => {
    setEditingComment(null);
    setEditText('');
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Group comments by parent
  const rootComments = comments?.filter(comment => !comment.parentId) || [];
  const repliesByParent = {};
  
  comments?.forEach(comment => {
    if (comment.parentId) {
      if (!repliesByParent[comment.parentId]) {
        repliesByParent[comment.parentId] = [];
      }
      repliesByParent[comment.parentId].push(comment);
    }
  });

  const CommentItem = ({ comment, isReply = false }) => {
    const replies = repliesByParent[comment._id] || [];
    
    return (
      <div className={`${isReply ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}>
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {comment.userId.slice(-2).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-800">User</p>
                <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
              </div>
            </div>
            
            {comment.userId === userId && (
              <div className="flex space-x-2">
                <button
                  onClick={() => startEdit(comment)}
                  className="text-gray-500 hover:text-blue-600 text-sm"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="text-gray-500 hover:text-red-600 text-sm"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            )}
          </div>
          
          {editingComment === comment._id ? (
            <div className="space-y-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg resize-none"
                rows="3"
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditComment(comment._id)}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-700 mb-3">{comment.message}</p>
              
              {!isReply && (
                <button
                  onClick={() => setReplyTo(replyTo === comment._id ? null : comment._id)}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                >
                  <FontAwesomeIcon icon={faReply} className="mr-1" />
                  Reply
                </button>
              )}
            </>
          )}
        </div>
        
        {/* Reply form */}
        {replyTo === comment._id && (
          <div className="ml-8 mb-4">
            <form onSubmit={handleSubmitComment} className="space-y-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a reply..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                rows="3"
              />
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Post Reply
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReplyTo(null);
                    setNewComment('');
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Replies */}
        {replies.map(reply => (
          <CommentItem key={reply._id} comment={reply} isReply={true} />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
          <FontAwesomeIcon icon={faComment} className="mr-2" />
          {lessonId ? 'Lesson Discussion' : 'Course Discussion'}
        </h3>
        
        {/* New comment form */}
        {!replyTo && (
          <form onSubmit={handleSubmitComment} className="space-y-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts or ask a question..."
              className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="4"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post Comment
            </button>
          </form>
        )}
      </div>
      
      {/* Comments list */}
      <div className="space-y-4">
        {rootComments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FontAwesomeIcon icon={faComment} className="text-4xl mb-4" />
            <p>No comments yet. Be the first to start a discussion!</p>
          </div>
        ) : (
          rootComments
            .sort((a, b) => b.createdAt - a.createdAt)
            .map(comment => (
              <CommentItem key={comment._id} comment={comment} />
            ))
        )}
      </div>
    </div>
  );
};

export default CommentsSection;