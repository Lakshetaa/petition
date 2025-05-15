import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { petitionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout/Layout';
import Button from '../components/UI/Button';

const categories = [
  'Environment',
  'Human Rights',
  'Education',
  'Health',
  'Animal Rights',
  'Politics',
  'Other',
];

const CreatePetitionPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [voteGoal, setVoteGoal] = useState(100);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not logged in
  if (!user) {
    navigate('/login', { replace: true });
    return null;
  }
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }
    
    if (!category) {
      newErrors.category = 'Category is required';
    }
    
    if (!voteGoal || voteGoal < 10) {
      newErrors.voteGoal = 'Vote goal must be at least 10';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const petitionData = {
        title,
        description,
        category,
        voteGoal,
      };
      
      const newPetition = await petitionAPI.create(petitionData);
      
      toast.success('Petition created successfully!');
      navigate(`/petition/${newPetition._id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create petition');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Create a New Petition</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Petition Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Give your petition a clear, attention-grabbing title"
                />
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Explain your cause and why people should support it"
                ></textarea>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
              </div>
              
              <div className="mb-6">
                <label htmlFor="voteGoal" className="block text-sm font-medium text-gray-700 mb-1">
                  Signature Goal <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="voteGoal"
                  value={voteGoal}
                  onChange={(e) => setVoteGoal(parseInt(e.target.value))}
                  min="10"
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.voteGoal ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.voteGoal && <p className="mt-1 text-sm text-red-500">{errors.voteGoal}</p>}
                <p className="mt-1 text-sm text-gray-500">
                  Set a realistic goal for your petition. You can always adjust it later.
                </p>
              </div>
              
              <div className="flex justify-end">
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                  size="lg"
                >
                  Create Petition
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreatePetitionPage;