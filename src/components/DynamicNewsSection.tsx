import React, { useState } from 'react';
import { Edit } from 'lucide-react';

interface NewsItem {
  id: string;
  category: string;
  date: string;
  title: string;
  content: string;
}

const DynamicNewsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [newsData, setNewsData] = useState<NewsItem[]>([
    {
      id: 'place-visited-1',
      category: 'Place Visited',
      date: 'Wednesday - 25/01/2023',
      title: 'President of Organizations Network - Halabja / Directorate of Women and Children Welfare - Erbil',
      content: 'The President of (Humanitarian Organization) paid a visit to the honorable (Asi Fayek), President of the Organizations Network, offering congratulations on his new position in martyr Halabja.\n\nAt the same time, a delegation from (Humanitarian Organization) visited the (Directorate of Women and Children Welfare - Erbil), where they were welcomed by the honorable (Taib Abdul Aziz Ahmad). These visits served both as gestures of goodwill and as opportunities to discuss future projects with children and students of the welfare center.'
    },
    {
      id: 'visitors-1',
      category: 'Visitors',
      date: 'Wednesday - 25/01/2023',
      title: 'Dr. Didar Sadiq - Eye Diseases Specialist',
      content: 'The honorable (Dr. Didar Sadiq), specialist in eye diseases, visited the (Humanitarian Organization), where he was welcomed by the President of the Organization. This visit was for the purpose of discussing increased assistance for poor and underprivileged patients.'
    },
    {
      id: 'certificate-awarded-1',
      category: 'Certificate Awarded',
      date: 'Thursday - 09/06/2022',
      title: 'Humanitarian Volunteers - University of Sulaymaniyah / Dr. Arsalan Sham',
      content: 'In recognition of the volunteer work in awareness-raising activities for students of the internal departments of (University of Sulaymaniyah), as well as the dedicated efforts of (Dr. Arsalan Sham) in providing assistance and treatment for poor patients and orphans, the (Humanitarian Organization) extended its sincere thanks and appreciation. Both the volunteers and Dr. Sham are acknowledged for their humanitarian contributions, and we wish them continued success and honor.'
    },
    {
      id: 'certificate-received-1',
      category: 'Certificate Received',
      date: 'Saturday - 04/06/2022',
      title: 'Al-Azhar Institute in Erbil',
      content: 'A delegation from (Al-Azhar Institute in Erbil) visited the (Humanitarian Organization). This visit was for the purpose of offering thanks and appreciation to the organization, in recognition of the assistance provided to the students of the internal departments of Al-Azhar Institute.'
    }
  ]);

  const categories = ['Place Visited', 'Visitors', 'Certificate Awarded', 'Certificate Received'];

  const filteredNews = selectedCategory 
    ? newsData.filter(item => item.category === selectedCategory)
    : [];

  const handleEdit = (id: string) => {
    setEditingItem(id);
  };

  const handleSave = (id: string, field: string, value: string) => {
    setNewsData(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
    setEditingItem(null);
  };

  const handleCancel = () => {
    setEditingItem(null);
  };

  const EditableField = ({ 
    value, 
    field, 
    itemId, 
    isTextarea = false, 
    placeholder = '' 
  }: {
    value: string;
    field: string;
    itemId: string;
    isTextarea?: boolean;
    placeholder?: string;
  }) => {
    const [tempValue, setTempValue] = useState(value);
    const isEditing = editingItem === itemId;

    if (!isEditing) {
      return (
        <span className={isTextarea ? 'whitespace-pre-line' : ''}>
          {value}
        </span>
      );
    }

    return (
      <div className="space-y-2">
        {isTextarea ? (
          <textarea
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            placeholder={placeholder}
            className="w-full p-2 border border-gray-300 rounded-lg resize-none min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        ) : (
          <input
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            placeholder={placeholder}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )}
        <div className="flex gap-2">
          <button
            onClick={() => handleSave(itemId, field, tempValue)}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">News Section</h2>
          <p className="text-gray-600 text-lg">Stay updated with our latest activities and achievements</p>
        </div>

        {/* Category Dropdown */}
        <div className="mb-8">
          <label htmlFor="category-select" className="block text-lg font-semibold text-gray-700 mb-3">
            Select News Category:
          </label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full max-w-md p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
          >
            <option value="">Choose a category...</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* News Cards */}
        {selectedCategory && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredNews.map(item => (
              <article
                key={item.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:scale-105"
              >
                <div className="p-6 relative">
                  {/* Edit Button */}
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit this news item"
                  >
                    <Edit size={18} />
                  </button>

                  {/* Date */}
                  <div className="mb-4">
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      <EditableField
                        value={item.date}
                        field="date"
                        itemId={item.id}
                        placeholder="Enter date..."
                      />
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4 pr-8">
                    <EditableField
                      value={item.title}
                      field="title"
                      itemId={item.id}
                      placeholder="Enter title..."
                    />
                  </h3>

                  {/* Content */}
                  <div className="text-gray-700 leading-relaxed">
                    <EditableField
                      value={item.content}
                      field="content"
                      itemId={item.id}
                      isTextarea={true}
                      placeholder="Enter content..."
                    />
                  </div>

                  {/* Category Badge */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {item.category}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Empty State */}
        {selectedCategory && filteredNews.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              No news items found for "{selectedCategory}" category.
            </div>
          </div>
        )}

        {/* Instructions */}
        {!selectedCategory && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <div className="text-gray-500 text-lg mb-4">
              Please select a category from the dropdown above to view news items.
            </div>
            <div className="text-sm text-gray-400">
              Available categories: {categories.join(', ')}
            </div>
          </div>
        )}
      </div>

      <style >{`
        @media (max-width: 768px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
        
        .hover\\:scale-105:hover {
          transform: scale(1.02);
        }
        
        .transition-all {
          transition: all 0.3s ease;
        }
        
        .shadow-lg {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        
        .shadow-xl {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        .rounded-2xl {
          border-radius: 1rem;
        }
        
        .whitespace-pre-line {
          white-space: pre-line;
        }
      `}</style>
    </section>
  );
};

export default DynamicNewsSection;
