"use client";
import React, { useState, useRef } from "react";
// import Image from "next/image";
import {
  UploadCloud,
  X,
  Loader2,
  Plus,
  Image,
  FileText,
  Settings,
  BookOpen,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";


const inputClasses =
  "w-full px-4 py-3 text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cc5f4d focus:border-transparent transition-all duration-200 placeholder-gray-400";
const labelClasses = "block mb-2 text-sm font-semibold text-gray-700";
const cardClasses = "bg-white p-6 rounded-2xl shadow-sm border border-gray-100";
const buttonClasses = {
  primary:
    "px-6 py-3 bg-cc5f4d text-white font-semibold rounded-lg hover:bg-cc5f4d/90 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg",
  secondary:
    "px-4 py-2 bg-6db19b text-white font-medium rounded-lg hover:bg-6db19b/90 transition-all duration-200 flex items-center justify-center gap-2",
  ghost:
    "p-2 text-gray-600 hover:text-cc5f4d hover:bg-ede7db rounded-lg transition-all duration-200",
};

const ImageUploader = ({ images, onUpload, onRemove, isUploading }) => {
  const inputRef = useRef(null);

  const handleFileChange = async (e) => {
const files = Array.from(e.target.files);
  if (!files.length) return;

  onUpload(files);
  
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) handleFileChange({ target: { files } });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-ede7db/50 hover:bg-ede7db transition-all duration-200 cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => inputRef.current?.click()}
      >
        <input
          type="file"
          ref={inputRef}
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="text-gray-600">
          <UploadCloud className="mx-auto h-12 w-12 text-cc5f4d mb-3" />
          <p className="text-lg font-semibold mb-1">Upload Blog Images</p>
          <p className="text-sm text-gray-500">
            Click to upload or drag & drop
          </p>
          <p className="text-xs text-gray-400 mt-1">
            PNG, JPG, WEBP up to 10MB
          </p>
        </div>
        {isUploading && (
          <div className="mt-4 flex items-center justify-center space-x-2 text-cc5f4d">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="font-medium">Uploading...</span>
          </div>
        )}
      </div>

      {images?.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Uploaded Images ({images.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((ul, i) => (
              <div key={i} className="relative group">
                <img
                  src={URL.createObjectURL(ul)}
                  width={300}
                  height={300}
                  alt="Blog Image"
                  className="rounded-lg object-cover w-full h-24 group-hover:scale-105 transition-transform duration-200"
                  // unoptimized
                />
                <div className="absolute inset-0 bg-black/20 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => onRemove(i)}
                    className="opacity-0 group-hover:opacity-100 transform transition-all duration-200 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const SectionCard = ({ section, index, onChange, onRemove }) => {
  const addParagraph = () => {
    const updated = { ...section, paragraphs: [...section.paragraphs, ""] };
    onChange(index, updated);
  };

  const removeParagraph = (paraIndex) => {
    const updated = {
      ...section,
      paragraphs: section.paragraphs.filter((_, i) => i !== paraIndex),
    };
    onChange(index, updated);
  };

  const addPoint = () => {
    const updated = { ...section, points: [...section.points, ""] };
    onChange(index, updated);
  };

  const removePoint = (pointIndex) => {
    const updated = {
      ...section,
      points: section.points.filter((_, i) => i !== pointIndex),
    };
    onChange(index, updated);
  };

  return (
    <div className="border border-gray-200 rounded-xl p-5 mb-4 bg-white hover:border-cc5f4d/30 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-6db19b" />
          Section {index + 1}
        </h3>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1 rounded"
        >
          <X size={18} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className={labelClasses}>Heading</label>
          <input
            className={inputClasses}
            value={section.heading}
            onChange={(e) =>
              onChange(index, { ...section, heading: e.target.value })
            }
            placeholder="Enter section heading..."
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={labelClasses}>Paragraphs</label>
            <button
              type="button"
              onClick={addParagraph}
              className="text-sm bg-6db19b text-white px-3 py-1 rounded-lg hover:bg-6db19b/90 transition-colors duration-200 flex items-center gap-1"
            >
              <Plus size={14} />
              Add
            </button>
          </div>
          <div className="space-y-3">
            {section?.paragraphs?.map((para, i) => (
              <div key={i} className="flex gap-2 group">
                <textarea
                  rows={3}
                  value={para}
                  onChange={(e) => {
                    const updated = { ...section };
                    updated.paragraphs[i] = e.target.value;
                    onChange(index, updated);
                  }}
                  className={inputClasses + " resize-none"}
                  placeholder="Enter paragraph content..."
                />
                {section.paragraphs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeParagraph(i)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-500 hover:text-red-700 p-2"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={labelClasses}>Key Points</label>
            <button
              type="button"
              onClick={addPoint}
              className="text-sm bg-6db19b text-white px-3 py-1 rounded-lg hover:bg-6db19b/90 transition-colors duration-200 flex items-center gap-1"
            >
              <Plus size={14} />
              Add
            </button>
          </div>
          <div className="space-y-2">
            {section.points.map((point, i) => (
              <div key={i} className="flex gap-2 group items-center">
                <div className="w-2 h-2 bg-cc5f4d rounded-full flex-shrink-0"></div>
                <input
                  value={point}
                  onChange={(e) => {
                    const updated = { ...section };
                    updated.points[i] = e.target.value;
                    onChange(index, updated);
                  }}
                  className={inputClasses}
                  placeholder="Enter key point..."
                />
                {section.points.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePoint(i)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-500 hover:text-red-700 p-2"
                  >
                    <X size={16} />
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
const SectionCard2 = ({ section, index, onChange, onRemove }) => {
  return (
    <div className="border border-gray-200 rounded-xl p-5 mb-4 bg-white hover:border-cc5f4d/30 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-6db19b" />
          FAQ {index + 1}
        </h3>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1 rounded"
        >
          <X size={18} />
        </button>
      </div>

      {/* <div className="space-y-4">
        <div>
          <label className={labelClasses}>Question</label>
          <input
            className={inputClasses}
            value={section.heading}
            onChange={(e) => onChange(index, { ...section, heading: e.target.value })}
            placeholder="Enter section heading..."
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={labelClasses}></label>
            <button
              type="button"
              onClick={addParagraph}
              className="text-sm bg-6db19b text-white px-3 py-1 rounded-lg hover:bg-6db19b/90 transition-colors duration-200 flex items-center gap-1"
            >
              <Plus size={14} />
              Add
            </button>
          </div>
          <div className="space-y-3">
            {section?.paragraphs?.map((para, i) => (
              <div key={i} className="flex gap-2 group">
                <textarea
                  rows={3}
                  value={para}
                  onChange={(e) => {
                    const updated = { ...section };
                    updated.paragraphs[i] = e.target.value;
                    onChange(index, updated);
                  }}
                  className={inputClasses + " resize-none"}
                  placeholder="Enter paragraph content..."
                />
                {section.paragraphs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeParagraph(i)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-500 hover:text-red-700 p-2"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={labelClasses}>Key Points</label>
            <button
              type="button"
              onClick={addPoint}
              className="text-sm bg-6db19b text-white px-3 py-1 rounded-lg hover:bg-6db19b/90 transition-colors duration-200 flex items-center gap-1"
            >
              <Plus size={14} />
              Add
            </button>
          </div>
          <div className="space-y-2">
            {section.points.map((point, i) => (
              <div key={i} className="flex gap-2 group items-center">
                <div className="w-2 h-2 bg-cc5f4d rounded-full flex-shrink-0"></div>
                <input
                  value={point}
                  onChange={(e) => {
                    const updated = { ...section };
                    updated.points[i] = e.target.value;
                    onChange(index, updated);
                  }}
                  className={inputClasses}
                  placeholder="Enter key point..."
                />
                {section.points.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePoint(i)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-500 hover:text-red-700 p-2"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div> */}

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
          />
        </div>
      </div>
    </div>
  );
};

export default function AddBlogPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [blog, setBlog] = useState({
    title: "",
    slug: "",
    service: "",
    city: "",
    date: "",
    tag: "",
    description: "",
    type: "academy",
    images: [],
    meta: {
      title: "",
      description: "",
    },
    sections: [
      {
        heading: "",
        paragraphs: [""],
        points: [""],
      },
    ],
    faqs: [{ question: "", answer: "" }],
  });

  const handleSectionChange = (index, updatedSection) => {
    const updated = [...blog.sections];
    updated[index] = updatedSection;
    setBlog({ ...blog, sections: updated });
  };
  const handlefaqChange = (index, updatedSection) => {
    const updated = [...blog.faqs];
    updated[index] = updatedSection;
    setBlog({ ...blog, faqs: updated });
  };
  const handleAddFAQ = () => {
    setBlog({
      ...blog,
      faqs: [...blog.faqs, { question: "", answer: "" }],
    });
  };
  const handleAddSection = () => {
    setBlog({
      ...blog,
      sections: [
        ...blog.sections,
        { heading: "", paragraphs: [""], points: [""] },
      ],
    });
  };

  const handleRemoveSection = (index) => {
    setBlog({
      ...blog,
      sections: blog.sections.filter((_, i) => i !== index),
    });
  };
  const handleRemovefaq = (index) => {
    setBlog({
      ...blog,
      faqs: blog.faqs.filter((_, i) => i !== index),
    });
  };

  const handleFileUpload = async (files) => {
setBlog((prev) => ({
    ...prev,
    images: [...(prev.images ?? []), ...files],
  }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    // Generate slug if missing
    const slug =
      blog.slug ||
      `${blog.title.trim().split(/\s+/).join("-")}-${Date.now()}`;

    const formData = new FormData();

    // 🔹 Simple fields
    formData.append("title", blog.title);
    formData.append("slug", slug);
    formData.append("service", blog.service);
    formData.append("city", blog.city);
    formData.append("date", blog.date);
    formData.append("tag", blog.tag);
    formData.append("description", blog.description);
    formData.append("type", blog.type);

    // 🔹 Objects / arrays
    formData.append("meta", JSON.stringify(blog.meta));
    formData.append("sections", JSON.stringify(blog.sections));
    formData.append("faqs", JSON.stringify(blog.faqs));

    // 🔹 Images (File[])
    (blog.images ?? []).forEach((file) => {
      formData.append("images", file);
    });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_LOCAL_PORT}/blogs`,
      {
        method: "POST",
        body: formData, // ❌ no headers
      }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Submission failed");

    toast.success("Blog added successfully!");
    setBlog({
      title: "",
      slug: "",
      service: "",
      city: "",
      date: "",
      tag: "",
      description: "",
      type: "academy",
      images: [],
      meta: { title: "", description: "" },
      sections: [{ heading: "", paragraphs: [""], points: [""] }],
      faqs: [{ question: "", answer: "" }],
    });
  } catch (err) {
    toast.error("Failed to add blog.");
    console.error(err);
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="min-h-screen bg-ede7db/30 p-6">
      <style jsx global>{`
        :root {
          --cc5f4d: #cc5f4d;
          --6db19b: #6db19b;
          --ede7db: #ede7db;
        }
        .bg-cc5f4d {
          background-color: #cc5f4d;
        }
        .bg-6db19b {
          background-color: #6db19b;
        }
        .bg-ede7db {
          background-color: #ede7db;
        }
        .text-cc5f4d {
          color: #cc5f4d;
        }
        .text-6db19b {
          color: #6db19b;
        }
        .border-cc5f4d {
          border-color: #cc5f4d;
        }
        .border-6db19b {
          border-color: #6db19b;
        }
        .focus\\:ring-cc5f4d:focus {
          --tw-ring-color: #cc5f4d;
        }
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

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-cc5f4d mb-2 flex items-center gap-3">
            <FileText className="h-8 w-8" />
            Add New Blog
          </h1>
          <p className="text-gray-600">
            Create and publish a new blog post with engaging content and SEO
            optimization
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Blog Information */}
          <div className={cardClasses}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <Settings className="h-6 w-6 text-cc5f4d" />
              <h2 className="text-xl font-semibold text-gray-800">
                Blog Information
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>Title</label>
                <input
                  className={inputClasses}
                  value={blog.title}
                  onChange={(e) => setBlog({ ...blog, title: e.target.value })}
                  placeholder="Enter blog title..."
                  required
                />
              </div>
              <div>
                <label className={labelClasses}>Slug</label>
                <input
                  className={inputClasses}
                  value={blog.slug}
                  onChange={(e) => setBlog({ ...blog, slug: e.target.value })}
                  placeholder="blog-url-slug"
                />
              </div>
              <div>
                <label className={labelClasses}>Service</label>
                <input
                  className={inputClasses}
                  value={blog.service}
                  onChange={(e) =>
                    setBlog({ ...blog, service: e.target.value })
                  }
                  placeholder="e.g., digital-marketing"
                  required
                />
              </div>
              <div>
                <label className={labelClasses}>City</label>
                <input
                  className={inputClasses}
                  value={blog.city}
                  onChange={(e) => setBlog({ ...blog, city: e.target.value })}
                  placeholder="e.g., patiala"
                  required
                />
              </div>
              <div>
                <label className={labelClasses}>Tag</label>
                <input
                  className={inputClasses}
                  value={blog.tag}
                  onChange={(e) => setBlog({ ...blog, tag: e.target.value })}
                  placeholder="e.g., Digital Marketing"
                  required
                />
              </div>
              <div>
                <label className={labelClasses}>Date</label>
                <input
                  type="text"
                  className={inputClasses}
                  placeholder="e.g., April 29, 2025"
                  value={blog.date}
                  onChange={(e) => setBlog({ ...blog, date: e.target.value })}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelClasses}>Description</label>
                <textarea
                  rows={3}
                  className={inputClasses}
                  value={blog.description}
                  onChange={(e) =>
                    setBlog({ ...blog, description: e.target.value })
                  }
                  placeholder="Enter a brief description of the blog..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Meta Information */}
          <div className={cardClasses}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <Settings className="h-6 w-6 text-6db19b" />
              <h2 className="text-xl font-semibold text-gray-800">
                SEO Meta Information
              </h2>
            </div>
            <div className="space-y-6 grid grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>Meta Title</label>
                <input
                  className={inputClasses}
                  value={blog.meta.title}
                  onChange={(e) =>
                    setBlog({
                      ...blog,
                      meta: { ...blog.meta, title: e.target.value },
                    })

                  }
                  placeholder="SEO title for search engines..."
                />
              </div>
              <div>
                <label className={labelClasses}>Select For</label>
                {/* <input
                  className={inputClasses}
                  value={blog.meta.title}
                  onChange={(e) =>
                    setBlog({
                      ...blog,
                      meta: { ...blog.meta, title: e.target.value },
                    })
                  }
                  placeholder="SEO title for search engines..."
                /> */}
                <select
                  value={blog.type}
                  onChange={(e) => setBlog({ ...blog, type: e.target.value })}
                  className={inputClasses}
                >
                  <option value={"academy"}>Academy</option>
                  <option value={"company"}>Company</option>
                </select>
              </div>
              <div className="col-span-full">
                <label className={labelClasses}>Meta Description</label>
                <textarea
                  rows={3}
                  className={inputClasses}
                  value={blog.meta.description}
                  onChange={(e) =>
                    setBlog({
                      ...blog,
                      meta: { ...blog.meta, description: e.target.value },
                    })
                  }
                  placeholder="SEO description for search engines..."
                />
              </div>
            </div>
          </div>

          {/* Blog Images */}
          <div className={cardClasses}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <Image className="h-6 w-6 text-cc5f4d" />
              <h2 className="text-xl font-semibold text-gray-800">
                Blog Images
              </h2>
            </div>
            <ImageUploader
              images={blog.images}
              onUpload={handleFileUpload}
              onRemove={(i) =>
                setBlog({
                  ...blog,
                  images: blog.images.filter((_, idx) => idx !== i),
                })
              }
              isUploading={isUploading}
            />
          </div>

          {/* Blog Sections */}
          <div className={cardClasses}>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-6db19b" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Blog Content Sections
                </h2>
              </div>
              <button
                type="button"
                onClick={handleAddSection}
                className={buttonClasses.secondary}
              >
                <Plus size={18} />
                Add Section
              </button>
            </div>

            <div className="space-y-6">
              {blog.sections.map((section, index) => (
                <SectionCard
                  key={index}
                  section={section}
                  index={index}
                  onChange={handleSectionChange}
                  onRemove={handleRemoveSection}
                />
              ))}
            </div>
          </div>

          <div className={cardClasses}>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-6db19b" />
                <h2 className="text-xl font-semibold text-gray-800">
                  FAQ Sections
                </h2>
              </div>
              <button
                type="button"
                onClick={handleAddFAQ}
                className={buttonClasses.secondary}
              >
                <Plus size={18} />
                Add FAQ
              </button>
            </div>

            {/* <div className="grid grid-cols-2 gap-6">
  <div>
    <p >Heading</p>
    <input type="text" placeholder="FAQ Heading..." onChange={(e)=>setDemofaq({...blog,question:e.target.value})} className={inputClasses} />
  </div>
   <div>
    <p >Answer</p>
    <input type="text" placeholder="FAQ Answer..." onChange={(e)=>setDemofaq({...blog,answer:e.target.value})} className={inputClasses} />
  </div>
  
</div> */}

            <div className="space-y-6">
              {blog.faqs?.map((section, index) => (
                <SectionCard2
                  key={index}
                  section={section}
                  index={index}
                  onChange={handlefaqChange}
                  onRemove={handleRemovefaq}
                />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={buttonClasses.primary}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <FileText className="h-5 w-5" />
                  Publish Blog
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
