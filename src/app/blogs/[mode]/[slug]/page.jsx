"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { UploadCloud, X, Loader2, Tag, Edit, Save, Plus, Trash2, Eye, FileText, Image, Settings, BookOpen } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";

const CLOUDINARY_CLOUD_NAME = "dj0z0q0ut";
const CLOUDINARY_UPLOAD_PRESET = "saajRiwaajProducts";

const inputClasses = "w-full px-4 py-3 text-gray-800 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cc5f4d focus:border-transparent transition-all duration-200 placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed";
const labelClasses = "block mb-2 text-sm font-semibold text-gray-700 uppercase tracking-wide";
const buttonClasses = {
  primary: "px-6 py-3 bg-cc5f4d text-white font-semibold rounded-lg hover:bg-cc5f4d/90 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg",
  secondary: "px-4 py-2 bg-6db19b text-white font-medium rounded-lg hover:bg-6db19b/90 transition-all duration-200 flex items-center justify-center gap-2",
  destructive: "px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center justify-center gap-2",
  ghost: "p-2 text-gray-600 hover:text-cc5f4d hover:bg-ede7db rounded-lg transition-all duration-200"
};
const cardClasses = "bg-white p-6 rounded-2xl shadow-sm border border-gray-200";
const sectionClasses = "bg-ede7db/50 rounded-xl p-5 border border-gray-300 hover:border-cc5f4d/30 transition-all duration-200";

const ImageUploader = ({ onUpload, onRemove, images, isUploading,newImages,onRemoveNew }) => {
  const inputRef = useRef();

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) onUpload(files);
  }, [onUpload]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  return (
    <div className="space-y-4">
      <div
        className={`border-3 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          isUploading 
            ? "border-cc5f4d bg-cc5f4d/10" 
            : "border-gray-300 hover:border-cc5f4d hover:bg-ede7db cursor-pointer"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => !isUploading && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files.length && onUpload(e.target.files)}
        />
        <div className="text-gray-600 flex flex-col items-center">
          <UploadCloud className="w-12 h-12 mb-3 text-cc5f4d" />
          <p className="text-lg font-semibold mb-1 text-gray-800">Upload Images</p>
          <p className="text-sm text-gray-500">Click to upload or drag & drop</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
        </div>
        {isUploading && (
          <div className="mt-4 flex justify-center items-center gap-2 text-cc5f4d">
            <Loader2 className="animate-spin h-5 w-5" />
            <span className="font-medium">Uploading...</span>
          </div>
        )}
      </div>

  
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <img className="w-4 h-4" />
            Uploaded Images ({images.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.length > 0 &&  images.map((url, i) => (
              <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-300 shadow-sm">
                <img
                  src={`${process.env.NEXT_PUBLIC_LOCAL_PORT_IMG}/uploads/${url}`}
                  width={200}
                  height={150}
                  alt={`Upload ${i + 1}`}
                  className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black/30 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => onRemove(i)}
                    className="opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-200 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
             {newImages.length > 0 && newImages.map((url, i) => (
              <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-300 shadow-sm">
                <img
                  src={URL.createObjectURL(url)}
                  width={200}
                  height={150}
                  alt={`Upload ${i + 1}`}
                  className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black/30 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => onRemoveNew(i)}
                    className="opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-200 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

    


    </div>
  );
};

const SectionEditor = ({ section, index, onChange, onRemove, isViewMode }) => {
  const addParagraph = () => {
    const updated = { ...section, paragraphs: [...section.paragraphs, ""] };
    onChange(index, updated);
  };

  const removeParagraph = (pIndex) => {
    const updated = { 
      ...section, 
      paragraphs: section.paragraphs.filter((_, i) => i !== pIndex) 
    };
    onChange(index, updated);
  };

  const updateParagraph = (pIndex, value) => {
    const updated = { 
      ...section, 
      paragraphs: section.paragraphs.map((p, i) => i === pIndex ? value : p) 
    };
    onChange(index, updated);
  };

  return (
    <div className={sectionClasses}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-6db19b" />
          Section {index + 1}
        </h4>
        {!isViewMode && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className={buttonClasses.destructive}
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className={labelClasses}>Heading</label>
          <input
            value={section.heading || ""}
            onChange={(e) => onChange(index, { ...section, heading: e.target.value })}
            disabled={isViewMode}
            placeholder="Enter section heading..."
            className={inputClasses}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={labelClasses}>Paragraphs</label>
            {!isViewMode && (
              <button
                type="button"
                onClick={addParagraph}
                className={buttonClasses.secondary}
              >
                <Plus className="h-4 w-4" />
                Add Paragraph
              </button>
            )}
          </div>
          <div className="space-y-3">
            {section.paragraphs.map((paragraph, pIndex) => (
              <div key={pIndex} className="flex gap-2 group">
                <textarea
                  value={paragraph || ""}
                  onChange={(e) => updateParagraph(pIndex, e.target.value)}
                  disabled={isViewMode}
                  className={`${inputClasses} resize-none`}
                  rows={3}
                  placeholder="Enter paragraph content..."
                />
                {!isViewMode && section.paragraphs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeParagraph(pIndex)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-500 hover:text-red-700 p-2"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionEditor2 = ({ section, index, onChange, onRemove, isViewMode }) => {

 return (
     <div className="border border-gray-200 rounded-xl p-5 mb-4 bg-white hover:border-cc5f4d/30 transition-all duration-200">
       <div className="flex items-center justify-between mb-4">
         <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
           <BookOpen className="h-5 w-5 text-6db19b" />
           FAQ {index + 1}
         </h3>
         {!isViewMode && 
         <button
           type="button"
           onClick={() => onRemove(index)}
           className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1 rounded"
         >
           <X size={18} />
         </button>
}
       </div>
 
       <div className="space-y-4">
         <div>
           <label className={labelClasses}>Question</label>
           <input
             className={inputClasses}
             value={section.question}
             onChange={(e) =>
               onChange(index, { ...section, question: e.target.value })
             }
             placeholder="Enter section Question..."
             disabled={isViewMode}
           />
         </div>
         <div>
           <label className={labelClasses}>Answer</label>
           <input
             className={inputClasses}
             value={section.answer}
             onChange={(e) =>
               onChange(index, { ...section, answer: e.target.value })
             }
             placeholder="Enter section answer..."
              disabled={isViewMode}
           />
         </div>
       </div>
     </div>
   );
};

export default function BlogEditorPage() {
  const { mode, slug } = useParams();
  const router = useRouter();
  const isViewMode = mode === "view";

  const [blog, setBlog] = useState({
    title: "",
    slug: "",
    service: "",
    city: "",
    tag: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    images: [],
    sections: [{ heading: "", paragraphs: [""] }],
    faqs: [{ question: "", answer: "" }],
  });

const [newData,setNewData] =useState({
  newImages:[],
  deleteImages:[]
})



  const [tagInput, setTagInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchBlog =async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_PORT}/blogs/single/${slug}`,
          { cache: "no-store" }
      );
      const data = await res.json();
     
      if(data.success){
      //   if (data.data.date) {
      //   const d = new Date(data.data.date);
      //   data.data.date = d.toISOString().split("T")[0];
      // }
      setBlog(data.data);
      }
      
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch blog data.");
    }
  }

  useEffect(() => {
   fetchBlog();
  }, [ slug ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlog((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (files) => {
    setIsUploading(true);
  setNewData((prev) => ({ ...prev, newImages: [...prev.newImages, ...files] }));
      setIsUploading(false);

  };

  const handleSectionChange = (index, updatedSection) => {
    const updatedSections = [...blog.sections];
    updatedSections[index] = updatedSection;
    setBlog(prev => ({ ...prev, sections: updatedSections }));
  };
  const handlefaqChange = (index, updatedSection) => {
    const updatedSections = [...blog.faqs];
    updatedSections[index] = updatedSection;
    setBlog(prev => ({ ...prev, faqs: updatedSections }));
  };

  const addSection = () => {
    setBlog(prev => ({
      ...prev,
      sections: [...prev.sections, { heading: "", paragraphs: [""] }]
    }));
  };
  const addfaq = () => {
    setBlog(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: ""}]
    }));
  };
  const removeSection = (index) => {
    setBlog(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };
  const removeFaq = (index) => {
    setBlog(prev => ({
      ...prev,
      faqs: prev.sections.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async (e) => {
  e.preventDefault();
  setIsSaving(true);

  try {
    const formData = new FormData();

    // Append normal blog fields
    formData.append("title", blog.title);
    formData.append("slug", blog.slug);
    formData.append("service", blog.service);
    formData.append("city", blog.city);
    formData.append("tag", blog.tag);
    formData.append("description", blog.description);
    formData.append("date", blog.date);

    // Existing images (keep)
    formData.append("images", JSON.stringify(blog.images));

    // Sections & FAQs (nested objects)
    formData.append("sections", JSON.stringify(blog.sections));
    formData.append("faqs", JSON.stringify(blog.faqs));

    // New images (FILES)
    newData.newImages.forEach((file) => {
      formData.append("newImages", file);
    });

   
    formData.append(
      "deleteImages",
      JSON.stringify(newData.deleteImages)
    );

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_LOCAL_PORT}/blogs/${slug}`,
      {
        method: "PUT",
        body: formData, 
      }
    );

    if (!res.ok) throw new Error("Failed to save blog");

    toast.success("Blog updated successfully!");
    router.push(`/blogs/view/${slug}`);
  } catch (err) {
    console.error(err);
    toast.error("Error updating blog");
  } finally {
    setIsSaving(false);
  }
};



const removeOldImage=(i)=>{
  if (!blog?.images?.length) return;
const img = blog.images[i];
  if (!img) return;
                    setBlog((prev) => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }))
                  
               setNewData(prev=>({...prev,    deleteImages: [...(prev.deleteImages || []), img],
}))
}

  return (
    <div className="min-h-screen bg-ede7db/30 p-6">
      <style jsx global>{`
        :root {
          --cc5f4d: #cc5f4d;
          --6db19b: #6db19b;
          --ede7db: #ede7db;
        }
        .bg-cc5f4d { background-color: #cc5f4d; }
        .bg-6db19b { background-color: #6db19b; }
        .bg-ede7db { background-color: #ede7db; }
        .text-cc5f4d { color: #cc5f4d; }
        .text-6db19b { color: #6db19b; }
        .border-cc5f4d { border-color: #cc5f4d; }
        .border-6db19b { border-color: #6db19b; }
        .hover\\:bg-cc5f4d:hover { background-color: #cc5f4d; }
        .hover\\:bg-6db19b:hover { background-color: #6db19b; }
        .focus\\:ring-cc5f4d:focus { --tw-ring-color: #cc5f4d; }
      `}</style>
      
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <form onSubmit={handleSave} className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className={cardClasses}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-cc5f4d mb-2 flex items-center gap-3">
                <FileText className="h-8 w-8" />
                {isViewMode ? "View Blog" : "Edit Blog"}
              </h1>
              <p className="text-gray-600">
                {isViewMode ? "Previewing blog content" : "Editing blog content and metadata"}
              </p>
            </div>
            
            <div className="flex gap-3">
              {isViewMode ? (
                <button
                  type="button"
                  onClick={() => router.push(`/blogs/edit/${slug}`)}
                  className={buttonClasses.primary}
                >
                  <Edit className="w-4 h-4" />
                  Edit Blog
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => router.push(`/blogs/view/${slug}`)}
                    className={buttonClasses.secondary}
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button 
                    type="submit" 
                    className={buttonClasses.primary}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Content - 3/4 width */}
          <div className="xl:col-span-3 space-y-6">
            {/* Basic Information */}
            <div className={cardClasses}>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <Settings className="h-6 w-6 text-cc5f4d" />
                <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className={labelClasses}>Title</label>
                  <input
                    name="title"
                    value={blog.title || ""}
                    onChange={handleChange}
                    disabled={isViewMode}
                    className={inputClasses}
                    placeholder="Enter blog title..."
                  />
                </div>
                <div>
                  <label className={labelClasses}>Slug</label>
                  <input
                    name="slug"
                    value={blog.slug || ""}
                    onChange={handleChange}
                    disabled={isViewMode}
                    className={inputClasses}
                    placeholder="blog-url-slug"
                  />
                </div>
                <div>
                  <label className={labelClasses}>Service</label>
                  <input
                    name="service"
                    value={blog.service || ""}
                    onChange={handleChange}
                    disabled={isViewMode}
                    className={inputClasses}
                    placeholder="e.g., digital-marketing"
                  />
                </div>
                <div>
                  <label className={labelClasses}>City</label>
                  <input
                    name="city"
                    value={blog.city || ""}
                    onChange={handleChange}
                    disabled={isViewMode}
                    className={inputClasses}
                    placeholder="e.g., patiala"
                  />
                </div>
                <div className="lg:col-span-2">
                  <label className={labelClasses}>Short Description</label>
                  <textarea
                    name="description"
                    value={blog.description || ""}
                    onChange={handleChange}
                    disabled={isViewMode}
                    className={`${inputClasses} resize-none`}
                    rows={3}
                    placeholder="Enter a brief description for the blog..."
                  />
                </div>
              </div>
            </div>

            {/* Blog Content Sections */}
            <div className={cardClasses}>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-6db19b" />
                  <h2 className="text-xl font-semibold text-gray-800">Blog Content</h2>
                </div>
                {!isViewMode && (
                  <button
                    type="button"
                    onClick={addSection}
                    className={buttonClasses.secondary}
                  >
                    <Plus className="w-4 h-4" />
                    Add Section
                  </button>
                )}
              </div>
              
              <div className="space-y-6">
                {blog?.sections?.map((section, index) => (
                  <SectionEditor
                    key={index}
                    section={section}
                    index={index}
                  
                      onChange={handleSectionChange}
                    onRemove={removeSection}
                    isViewMode={isViewMode}
                  />
                ))}
              </div>
            </div>




  <div className={cardClasses}>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-6db19b" />
                  <h2 className="text-xl font-semibold text-gray-800">FAQ Content</h2>
                </div>
                {!isViewMode && (
                  <button
                    type="button"
                    onClick={addfaq}
                    className={buttonClasses.secondary}
                  >
                    <Plus className="w-4 h-4" />
                    Add Section
                  </button>
                )}
              </div>
              
              <div className="space-y-6">
                {blog?.faqs?.map((section, index) => (
                  <SectionEditor2
                    key={index}
                    section={section}
                    index={index}
                     onChange={handlefaqChange}
                    onRemove={removeFaq}
                    isViewMode={isViewMode}
                  />
                ))}
              </div>
            </div>






            {/* Images Section */}
            <div className={cardClasses}>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <img className="h-6 w-6 text-cc5f4d" />
                <h2 className="text-xl font-semibold text-gray-800">Blog Images</h2>
              </div>
              {!isViewMode ? (
                <ImageUploader
                  images={blog.images || []}
                  onUpload={handleFileUpload}
                  onRemove={(i) =>{
                    removeOldImage(i)
                  
                  
                  }
                  }
                  onRemoveNew={(i)=>setNewData(prev=>({...prev,newImages:prev.newImages.filter((_,idx) => idx !== i)}))}

                  newImages= {newData.newImages}
                  isUploading={isUploading}
                />
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {(blog.images || []).map((img, i) => (
                    <div key={i} className="relative rounded-xl overflow-hidden border border-gray-300 shadow-sm">
                      <img
                        src={`${process.env.NEXT_PUBLIC_LOCAL_PORT_IMG}/uploads/${img}`}
                        width={200}
                        height={150}
                        alt={`Blog image ${i + 1}`}
                        className="w-full h-32 object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - 1/4 width */}
          <div className="space-y-6">
            {/* Publishing Details */}
            <div className={cardClasses}>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-6db19b" />
                Publishing Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className={labelClasses}>Tag</label>
                  <input
                    name="tag"
                    value={blog.tag || ""}
                    onChange={handleChange}
                    disabled={isViewMode}
                    className={inputClasses}
                    placeholder="e.g., Digital Marketing"
                  />
                </div>
                <div>
                  <label className={labelClasses}>Publish Date</label>
                  <input
                    name="date"
                    type="date"
                    value={blog.date || ""}
                    onChange={handleChange}
                    disabled={isViewMode}
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>

            {/* SEO Preview */}
            <div className={cardClasses}>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-cc5f4d" />
                SEO Preview
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600 block mb-1 font-medium">Title:</span>
                  <p className="text-cc5f4d font-medium line-clamp-2 bg-ede7db p-2 rounded-lg">{blog.title || "No title"}</p>
                </div>
                <div>
                  <span className="text-gray-600 block mb-1 font-medium">Description:</span>
                  <p className="text-gray-700 line-clamp-3 bg-ede7db p-2 rounded-lg">{blog.description || "No description"}</p>
                </div>
                <div>
                  <span className="text-gray-600 block mb-1 font-medium">Slug:</span>
                  <p className="text-6db19b font-mono bg-ede7db p-2 rounded-lg">/{blog.slug || "no-slug"}</p>
                </div>
              </div>
            </div>

          
            <div className={cardClasses}>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Content Stats</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-3 bg-ede7db rounded-lg">
                  <div className="text-2xl font-bold text-cc5f4d">{blog.sections?.length || 0}</div>
                  <div className="text-gray-600 text-xs font-medium">Sections</div>
                </div>
                <div className="text-center p-3 bg-ede7db rounded-lg">
                  <div className="text-2xl font-bold text-6db19b">{blog.images?.length || 0}</div>
                  <div className="text-gray-600 text-xs font-medium">Images</div>
                </div>
                <div className="text-center p-3 bg-ede7db rounded-lg col-span-2">
                  <div className="text-2xl font-bold text-cc5f4d">
                    {blog.sections?.reduce((total, sec) => total + (sec.paragraphs?.length || 0), 0) || 0}
                  </div>
                  <div className="text-gray-600 text-xs font-medium">Total Paragraphs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}