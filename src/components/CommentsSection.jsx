import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, Typography, List, ListItem, ListItemText, Card, CardHeader, Divider, CardContent, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import MoreVert from '@mui/icons-material/MoreVert';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

function CommentsSection({ recipeId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);

    useEffect(() => {
        const fetchComments = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:4000/api/recipes/${recipeId}/comments`);
                if (!response.ok) {
                    throw new Error('Failed to fetch comments');
                }
                const data = await response.json();
                setComments(data);
            } catch (error) {
                console.error('Failed to fetch comments:', error);
                setError('Failed to fetch comments');
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [recipeId]);

    const handleOpenDeleteDialog = (commentId) => {
        setCommentToDelete(commentId); // Set the comment to be deleted
        setOpenDeleteDialog(true);
    };
    
    const handleDelete = async () => {
        // Call deleteComment function with the stored commentId to delete
        await deleteComment(commentToDelete);
        setOpenDeleteDialog(false); // Close the dialog after deletion
    };

    const deleteComment = async (commentId) => {
        try {
            const response = await fetch(`http://localhost:4000/api/recipes/${recipeId}/comments/${commentId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to delete comment.');
            }

            // Update state to remove the deleted comment
            setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
            alert('Comment deleted successfully!');
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('An error occurred while deleting the comment.');
        }
    };

    const submitComment = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`http://localhost:4000/api/recipes/${recipeId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ comment: newComment }),
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to submit comment');
            }
            const addedComment = await response.json();
            setComments(prev => [addedComment, ...prev]);
            setNewComment('');
        } catch (error) {
            console.error('Failed to submit comment:', error);
            setError('Failed to submit comment');
        } finally {
            setLoading(false);
        }
    };

      if(loading) return <Typography>Loading comments...</Typography>;
      if(error) return <Typography color="error">{error}</Typography>;

      return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Comments</Typography>
            {/* Comment submission form */}
            {comments.map((comment) => (
                <Card key={comment.id} sx={{ mb: 2 }}>
                    <CardHeader
                        avatar={
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                {comment.username}
                            </Typography>
                        }
                        action={
                            <IconButton onClick={() => handleOpenDeleteDialog(comment.id)} aria-label="Delete">
                                <DeleteOutlineIcon />
                            </IconButton>
                        }
                        title={comment.comment}
                        subheader={new Date(comment.created_at).toLocaleDateString()}
                    />
                </Card>
            ))}
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this comment?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                    <Button onClick={handleDelete} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default CommentsSection;