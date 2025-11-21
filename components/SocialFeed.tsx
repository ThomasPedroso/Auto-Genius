
import React, { useState, useRef } from 'react';
import { Heart, MessageCircle, Repeat, Share, Send, Image as ImageIcon, X, Calendar as CalendarIcon, MapPin, Users, Ticket } from 'lucide-react';
import type { Post, User, Comment } from '../types';
import { MOCK_POSTS, MOCK_EVENTS } from '../constants';
import ImageWithFallback from './common/ImageWithFallback';

interface SocialFeedProps {
  user: User;
}

type Tab = 'feed' | 'events';

const SocialFeed: React.FC<SocialFeedProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<Tab>('feed');
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [newCommentContent, setNewCommentContent] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const isLiked = !post.isLiked;
        return {
          ...post,
          isLiked,
          likes: isLiked ? post.likes + 1 : post.likes - 1
        };
      }
      return post;
    }));
  };

  const handleAddPost = () => {
    if (!newPostContent.trim() && !newPostImage) return;

    const newPost: Post = {
      id: Date.now().toString(),
      authorName: user.name,
      authorHandle: `@${user.name.replace(/\s+/g, '').toLowerCase()}`,
      authorAvatar: user.avatarUrl,
      content: newPostContent,
      imageUrl: newPostImage || undefined,
      likes: 0,
      comments: [],
      timestamp: 'Agora',
      isLiked: false
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setNewPostImage(null);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPostImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const removeSelectedImage = () => {
    setNewPostImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleComments = (postId: string) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
    } else {
      setExpandedPostId(postId);
    }
    setNewCommentContent('');
  };

  const handleAddComment = (postId: string) => {
      if (!newCommentContent.trim()) return;

      setPosts(posts.map(post => {
          if (post.id === postId) {
              const newComment: Comment = {
                  id: Date.now().toString(),
                  authorName: user.name,
                  authorAvatar: user.avatarUrl,
                  content: newCommentContent,
                  timestamp: 'Agora'
              };
              return {
                  ...post,
                  comments: [...post.comments, newComment]
              };
          }
          return post;
      }));
      setNewCommentContent('');
  };

  return (
    <div className="min-h-screen bg-gray-900 pb-20">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
             <h1 className="text-xl font-bold text-white p-4 pb-2">Comunidade</h1>
             <div className="flex px-4 gap-6">
                <button 
                    onClick={() => setActiveTab('feed')}
                    className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
                        activeTab === 'feed' ? 'text-white border-brand-blue' : 'text-gray-500 border-transparent hover:text-gray-300'
                    }`}
                >
                    Feed
                </button>
                <button 
                    onClick={() => setActiveTab('events')}
                    className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
                        activeTab === 'events' ? 'text-white border-brand-blue' : 'text-gray-500 border-transparent hover:text-gray-300'
                    }`}
                >
                    Eventos
                </button>
             </div>
        </header>

        {activeTab === 'feed' ? (
            <>
                {/* New Post Input */}
                <div className="p-4 border-b border-gray-800 flex gap-4">
                    <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1">
                        <textarea
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            placeholder="O que está acontecendo no mundo automotivo?"
                            className="w-full bg-transparent text-white placeholder-gray-500 text-lg resize-none focus:outline-none min-h-[80px]"
                        />
                        
                        {newPostImage && (
                            <div className="relative mt-2 mb-2 rounded-xl overflow-hidden max-w-md">
                                <img src={newPostImage} alt="Preview" className="w-full h-auto object-cover" />
                                <button 
                                    onClick={removeSelectedImage}
                                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}

                        <div className="flex justify-between items-center mt-2 border-t border-gray-800 pt-3">
                            <button 
                                onClick={triggerImageUpload}
                                className="text-brand-blue hover:bg-brand-blue/10 p-2 rounded-full transition-colors relative"
                            >
                                <ImageIcon size={20} />
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleImageSelect} 
                                    accept="image/*" 
                                    className="hidden" 
                                />
                            </button>
                            <button
                                onClick={handleAddPost}
                                disabled={!newPostContent.trim() && !newPostImage}
                                className="bg-brand-blue text-white font-bold py-1.5 px-5 rounded-full hover:bg-brand-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Postar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Feed List */}
                <div>
                    {posts.map(post => (
                        <div key={post.id} className="border-b border-gray-800 p-4 hover:bg-gray-900/30 transition-colors">
                            <div className="flex gap-3">
                                <img src={post.authorAvatar} alt={post.authorName} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-white">{post.authorName}</span>
                                        <span className="text-gray-500 text-sm">{post.authorHandle} · {post.timestamp}</span>
                                    </div>
                                    <p className="text-gray-200 mb-3 whitespace-pre-wrap">{post.content}</p>
                                    
                                    {post.imageUrl && (
                                        <div className="rounded-xl overflow-hidden border border-gray-800 mb-3">
                                            <ImageWithFallback 
                                              src={post.imageUrl} 
                                              alt="Post content" 
                                              className="w-full h-auto max-h-96 object-cover"
                                              fallbackType="general"
                                            />
                                        </div>
                                    )}

                                    {/* Action Bar */}
                                    <div className="flex justify-between text-gray-500 max-w-md mt-2">
                                        <button 
                                            onClick={() => toggleComments(post.id)}
                                            className={`flex items-center gap-2 hover:text-brand-blue transition-colors group ${expandedPostId === post.id ? 'text-brand-blue' : ''}`}
                                        >
                                            <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
                                            <span className="text-sm font-medium">{post.comments.length}</span>
                                        </button>
                                        <button className="flex items-center gap-2 hover:text-brand-teal transition-colors group">
                                            <Repeat size={20} className="group-hover:scale-110 transition-transform" />
                                        </button>
                                        
                                        {/* Heart / Like Button */}
                                        <button 
                                            onClick={() => handleLike(post.id)}
                                            className={`flex items-center gap-2 transition-colors group ${
                                                post.isLiked ? 'text-brand-red' : 'text-gray-500 hover:text-brand-red'
                                            }`}
                                        >
                                            <Heart 
                                                size={20} 
                                                className={`transition-transform duration-200 ${
                                                    post.isLiked ? 'fill-current scale-110' : 'group-hover:scale-110'
                                                }`} 
                                            />
                                            <span className={`text-sm font-medium ${
                                                post.isLiked ? 'text-brand-red' : 'text-gray-500 group-hover:text-brand-red'
                                            }`}>
                                                {post.likes}
                                            </span>
                                        </button>

                                        <button className="flex items-center gap-2 hover:text-brand-blue transition-colors group">
                                            <Share size={20} className="group-hover:scale-110 transition-transform" />
                                        </button>
                                    </div>

                                    {/* Comments Section */}
                                    {expandedPostId === post.id && (
                                        <div className="mt-4 border-t border-gray-800 pt-4">
                                            {/* Comment Input */}
                                            <div className="flex gap-3 mb-4">
                                                <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                                                <div className="flex-1 flex gap-2">
                                                    <input 
                                                        type="text" 
                                                        value={newCommentContent}
                                                        onChange={(e) => setNewCommentContent(e.target.value)}
                                                        placeholder="Postar sua resposta"
                                                        className="flex-1 bg-gray-800 border-none rounded-full px-4 text-white placeholder-gray-500 focus:ring-1 focus:ring-brand-blue focus:outline-none"
                                                    />
                                                    <button 
                                                        onClick={() => handleAddComment(post.id)}
                                                        disabled={!newCommentContent.trim()}
                                                        className="text-brand-blue disabled:opacity-50"
                                                    >
                                                        <Send size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            {/* Comments List */}
                                            <div className="space-y-4">
                                                {post.comments.map(comment => (
                                                    <div key={comment.id} className="flex gap-3">
                                                        <img src={comment.authorAvatar} alt={comment.authorName} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                                                        <div className="bg-gray-800/50 p-3 rounded-2xl rounded-tl-none flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="font-bold text-sm text-white">{comment.authorName}</span>
                                                                <span className="text-xs text-gray-500">· {comment.timestamp}</span>
                                                            </div>
                                                            <p className="text-gray-300 text-sm">{comment.content}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        ) : (
            // Events View
            <div className="p-4 space-y-4">
                <div className="bg-brand-blue/10 border border-brand-blue/30 rounded-lg p-4 mb-4">
                    <h3 className="text-brand-blue font-bold text-lg mb-1">Calendário Automotivo</h3>
                    <p className="text-sm text-gray-300">Fique por dentro dos principais eventos, track days e encontros da sua região.</p>
                </div>

                {MOCK_EVENTS.map((event) => (
                    <div key={event.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 flex flex-col sm:flex-row">
                         <div className="sm:w-48 h-40 sm:h-auto relative shrink-0">
                             <ImageWithFallback 
                                src={event.imageUrl} 
                                alt={event.title} 
                                className="w-full h-full object-cover"
                                fallbackType="general"
                             />
                             <div className="absolute top-2 right-2 bg-gray-900/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-white border border-gray-600">
                                 {event.price}
                             </div>
                         </div>
                         <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                                <p className="text-brand-orange font-bold text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                                    <CalendarIcon size={12} />
                                    {event.date}
                                </p>
                                <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                                <div className="flex items-center text-gray-400 text-sm mb-2">
                                    <MapPin size={14} className="mr-1" />
                                    {event.location}
                                </div>
                                <div className="flex items-center text-gray-500 text-xs">
                                    <Users size={12} className="mr-1" />
                                    {event.attendees} confirmados
                                </div>
                            </div>
                            <button className="mt-4 w-full sm:w-auto bg-gray-700 hover:bg-brand-blue text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                                <Ticket size={16} />
                                Confirmar Presença
                            </button>
                         </div>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
};

export default SocialFeed;
