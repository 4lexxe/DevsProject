import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { getCommentsByResource, createComment, updateComment, deleteComment } from '../services/comment.service';
import { usePermissions } from '../../shared/hooks/usePermissions';
const Comment = ({ resourceId }) => {
    const { user, canModifyComment, hasPermission } = usePermissions();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const fetchComments = async () => {
        try {
            setLoading(true);
            setError(null);
            const commentsData = await getCommentsByResource(resourceId);
            const commentsWithUserInfo = commentsData.map((comment) => ({
                ...comment,
                User: comment.User || {
                    id: comment.userId,
                    name: `Usuario ${comment.userId}`,
                    avatar: `https://ui-avatars.com/api/?name=Usuario+${comment.userId}&background=random`
                }
            }));
            setComments(commentsWithUserInfo);
        }
        catch (err) {
            setError('Error al cargar los comentarios');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchComments();
    }, [resourceId]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || submitting)
            return;
        if (!hasPermission('comment:resources')) {
            setError('No tienes permisos para comentar');
            return;
        }
        try {
            setSubmitting(true);
            await createComment({ resourceId, content: newComment.trim() });
            setNewComment('');
            fetchComments();
        }
        catch (err) {
            setError('Error al crear el comentario');
        }
        finally {
            setSubmitting(false);
        }
    };
    const handleEdit = async (commentId) => {
        if (!editContent.trim())
            return;
        try {
            await updateComment(commentId, { content: editContent.trim() });
            setEditingId(null);
            setEditContent('');
            fetchComments();
        }
        catch (err) {
            setError('Error al actualizar el comentario');
        }
    };
    const handleDelete = async (commentId) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este comentario?'))
            return;
        try {
            await deleteComment(commentId);
            fetchComments();
        }
        catch (err) {
            setError('Error al eliminar el comentario');
        }
    };
    const startEdit = (comment) => {
        if (comment.id) {
            setEditingId(comment.id);
            setEditContent(comment.content);
        }
    };
    const cancelEdit = () => {
        setEditingId(null);
        setEditContent('');
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    const canComment = hasPermission('comment:resources');
    if (loading) {
        return (_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Comentarios" }), _jsxs("div", { className: "animate-pulse", children: [_jsx("div", { className: "h-4 bg-gray-300 rounded w-1/4 mb-4" }), _jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "h-16 bg-gray-300 rounded" }), _jsx("div", { className: "h-16 bg-gray-300 rounded" })] })] })] }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-900", children: ["Comentarios (", comments.length, ")"] }), error && (_jsxs("div", { className: "p-4 bg-red-50 border border-red-200 rounded-md", children: [_jsx("p", { className: "text-red-600 text-sm", children: error }), _jsx("button", { onClick: () => setError(null), className: "mt-2 text-red-500 hover:text-red-700 text-xs underline", children: "Cerrar" })] })), canComment ? (_jsx("form", { onSubmit: handleSubmit, className: "space-y-4", children: _jsxs("div", { children: [_jsx("textarea", { value: newComment, onChange: (e) => setNewComment(e.target.value), placeholder: "Escribe tu comentario...", className: "w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none", rows: 3, maxLength: 500 }), _jsxs("div", { className: "flex justify-between items-center mt-2", children: [_jsxs("span", { className: "text-xs text-gray-500", children: [newComment.length, "/500 caracteres"] }), _jsx("button", { type: "submit", disabled: !newComment.trim() || submitting, className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors", children: submitting ? 'Enviando...' : 'Comentar' })] })] }) })) : (_jsxs("div", { className: "p-4 bg-yellow-50 border border-yellow-200 rounded-md", children: [_jsx("p", { className: "text-yellow-800 text-sm", children: !user
                            ? '🔒 Debes iniciar sesión para comentar.'
                            : '⚠️ No tienes permisos para comentar en este recurso.' }), !user && (_jsx("button", { onClick: () => window.location.href = '/login', className: "mt-2 text-yellow-600 hover:text-yellow-800 text-sm underline", children: "Iniciar sesi\u00F3n" }))] })), _jsx("div", { className: "space-y-4", children: comments.length === 0 ? (_jsxs("p", { className: "text-gray-500 text-center py-8", children: ["No hay comentarios a\u00FAn. ", canComment ? '¡Sé el primero en comentar!' : ''] })) : (comments.map((comment) => {
                    const canEditComment = canModifyComment(comment.userId);
                    return (_jsxs("div", { className: "bg-gray-50 rounded-lg p-4 space-y-3", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("img", { src: comment.User?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.User?.name || 'Usuario')}&background=random`, alt: comment.User?.name, className: "w-8 h-8 rounded-full object-cover" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900 text-sm", children: comment.User?.name || `Usuario ${comment.userId}` }), _jsxs("p", { className: "text-xs text-gray-500", children: [comment.createdAt && formatDate(comment.createdAt), comment.updatedAt && comment.createdAt && comment.updatedAt !== comment.createdAt && ' (editado)'] })] })] }), canEditComment && (_jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { onClick: () => startEdit(comment), className: "text-blue-600 hover:text-blue-800 text-xs", children: "Editar" }), _jsx("button", { onClick: () => comment.id && handleDelete(comment.id), className: "text-red-600 hover:text-red-800 text-xs", children: "Eliminar" })] }))] }), editingId === comment.id ? (_jsxs("div", { className: "space-y-2", children: [_jsx("textarea", { value: editContent, onChange: (e) => setEditContent(e.target.value), className: "w-full p-2 border border-gray-300 rounded-md text-sm", rows: 2, maxLength: 500 }), _jsxs("div", { className: "flex justify-end space-x-2", children: [_jsx("button", { onClick: cancelEdit, className: "px-3 py-1 text-gray-600 hover:text-gray-800 text-xs", children: "Cancelar" }), _jsx("button", { onClick: () => comment.id && handleEdit(comment.id), className: "px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700", children: "Guardar" })] })] })) : (_jsx("p", { className: "text-gray-700 text-sm leading-relaxed whitespace-pre-wrap", children: comment.content }))] }, comment.id));
                })) })] }));
};
export default Comment;
