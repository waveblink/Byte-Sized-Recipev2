import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, Typography, List, ListItem, ListItemText, Card, CardHeader, Divider, CardContent, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import MoreVert from '@mui/icons-material/MoreVert';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import axios from 'axios';

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
                // Ensure you're using template literals correctly with backticks (`) 
                const response = await axios.get(`http://localhost:4000/api/recipes/${recipeId}/comments`, {
                    withCredentials: true
                });
    
                // Axios automatically parses the JSON, so you can directly use the data property.
                setComments(response.data);
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
            const response = await axios.delete(`http://localhost:4000/api/recipes/${recipeId}/comments/${commentId}`, {
                withCredentials: true
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
            // With Axios, you don't need to specify headers or stringify the body for JSON data.
            // Axios automatically sets the content-type to 'application/json' and converts the JavaScript object to JSON.
            const response = await axios.post(`http://localhost:4000/api/recipes/${recipeId}/comments`, { comment: newComment }, {
                withCredentials: true
            });
    
            // Axios automatically parses the JSON response, so you can directly use the data property.
            const addedComment = response.data;
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
            {/* Comment submission form */
            <form onSubmit={submitComment} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                multiline
                rows={2}
                maxRows={4}
            />
            <Button type="submit" variant="contained" color="primary">
                Post
            </Button>
        </form>}
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