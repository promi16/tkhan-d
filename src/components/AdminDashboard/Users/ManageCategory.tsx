import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Upload, Loader2, Pencil, Check } from "lucide-react";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../../../redux/features/category/categoryApi";
import { Category } from "../../../redux/features/category/categoryTypes";
import toast from "react-hot-toast";

interface FormState {
  name: string;
  description: string;
  active: boolean;
  image: File | null;
  previewUrl: string | null;
}

const defaultForm: FormState = {
  name: "",
  description: "",
  active: true,
  image: null,
  previewUrl: null,
};

const ManageCategory = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, isError } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const categories = data?.data?.items ?? [];
  const isSaving = isCreating || isUpdating;

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setForm(defaultForm);
    setIsFormVisible(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name,
      description: cat.description,
      active: cat.active,
      image: null,
      previewUrl: cat.imageUrl,
    });
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    setEditingCategory(null);
    setForm(defaultForm);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({
      ...prev,
      image: file,
      previewUrl: URL.createObjectURL(file),
    }));
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id).unwrap();
      toast.success("Category deleted!");
    } catch {
      toast.error("Failed to delete category.");
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.description.trim()) {
      toast.error("Name and description are required.");
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory({
          id: editingCategory.id,
          name: form.name,
          description: form.description,
          active: form.active,
          image: form.image ?? undefined,
        }).unwrap();
        toast.success("Category updated!");
      } else {
        await createCategory({
          name: form.name,
          description: form.description,
          active: form.active,
          image: form.image ?? undefined,
        }).unwrap();
        toast.success("Category created!");
      }
      handleCloseForm();
    } catch {
      toast.error(
        editingCategory
          ? "Failed to update category."
          : "Failed to create category.",
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#FAFAFA] p-4 sm:p-6 md:p-8 lg:p-12 font-sans"
    >
      <div className="max-w-[1300px] mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap gap-3 sm:gap-[16px] md:gap-[18px] max-w-[800px] w-full"
          >
            {isLoading && (
              <div className="flex items-center gap-2 text-gray-400 py-10">
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                <span className="text-xs sm:text-sm">
                  Loading categories...
                </span>
              </div>
            )}

            {isError && !isLoading && (
              <p className="text-red-500 text-xs sm:text-sm py-10">
                Failed to load categories.
              </p>
            )}

            <AnimatePresence>
              {!isLoading &&
                !isError &&
                categories.map((cat, index) => (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="relative w-[90px] h-[94px] sm:w-[104px] sm:h-[108px] md:w-[112px] md:h-[116px] bg-[#FFF6F3] rounded-[12px] sm:rounded-[14px] flex flex-col items-center justify-center group border border-transparent hover:border-[#FFE4DC] hover:shadow-lg transition-all"
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(cat.id)}
                      className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 text-[#FF6B35]/70 hover:text-[#FF6B35] transition-colors cursor-pointer z-10"
                    >
                      <X size={11} strokeWidth={2.5} className="sm:hidden" />
                      <X
                        size={13}
                        strokeWidth={2.5}
                        className="hidden sm:block"
                      />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleOpenEdit(cat)}
                      className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 text-[#FF6B35]/50 hover:text-[#FF6B35] transition-colors cursor-pointer z-10"
                    >
                      <Pencil
                        size={9}
                        strokeWidth={2.5}
                        className="sm:hidden"
                      />
                      <Pencil
                        size={11}
                        strokeWidth={2.5}
                        className="hidden sm:block"
                      />
                    </motion.button>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="w-[42px] h-[42px] sm:w-[48px] sm:h-[48px] md:w-[52px] md:h-[52px] bg-white rounded-full flex items-center justify-center mb-1.5 sm:mb-2 shadow-[0_2px_8px_rgba(255,107,53,0.04)] overflow-hidden"
                    >
                      {cat.imageUrl ? (
                        <img
                          src={cat.imageUrl}
                          alt={cat.name}
                          className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 object-contain"
                        />
                      ) : (
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
                      )}
                    </motion.div>

                    <span className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-[#5C2B18] text-center px-1 block line-clamp-1">
                      {cat.name}
                    </span>

                    <span
                      className={`text-[8px] sm:text-[9px] font-semibold mt-0.5 px-1.5 sm:px-2 py-0.5 rounded-full ${
                        cat.active
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {cat.active ? "Active" : "Inactive"}
                    </span>
                  </motion.div>
                ))}
            </AnimatePresence>

            {!isLoading && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleOpenCreate}
                className="w-[90px] h-[94px] sm:w-[104px] sm:h-[108px] md:w-[112px] md:h-[116px] border-2 border-dashed border-[#CCCCCC] rounded-[12px] sm:rounded-[14px] flex items-center justify-center bg-white cursor-pointer hover:border-[#FF6B35] hover:bg-[#FFF6F3] transition-all"
              >
                <div className="w-[42px] h-[42px] sm:w-[48px] sm:h-[48px] md:w-[52px] md:h-[52px] bg-[#FFF6F3] rounded-full flex items-center justify-center text-[#FF6B35]">
                  <Plus size={16} strokeWidth={2.5} className="sm:hidden" />
                  <Plus
                    size={18}
                    strokeWidth={2.5}
                    className="hidden sm:block md:hidden"
                  />
                  <Plus
                    size={20}
                    strokeWidth={2.5}
                    className="hidden md:block"
                  />
                </div>
              </motion.div>
            )}
          </motion.div>

          <AnimatePresence>
            {isFormVisible && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 40, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.96 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full max-w-full sm:max-w-[360px] md:max-w-[390px] lg:mt-0"
              >
                <motion.div
                  whileHover={{ y: -2 }}
                  className="bg-[#FFF1EC] rounded-2xl p-4 sm:p-5 md:p-6 border border-[#FFE1D7] shadow-sm relative"
                >
                  <button
                    onClick={handleCloseForm}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 text-[#FF6B35]/60 hover:text-[#FF6B35] transition-colors cursor-pointer"
                  >
                    <X size={14} strokeWidth={2.5} className="sm:hidden" />
                    <X
                      size={16}
                      strokeWidth={2.5}
                      className="hidden sm:block"
                    />
                  </button>

                  <p className="text-[10px] sm:text-xs font-bold text-[#FF6B35] uppercase tracking-widest mb-3 sm:mb-4">
                    {editingCategory ? "Edit Category" : "New Category"}
                  </p>

                  <div className="mb-3 sm:mb-4">
                    <label className="block text-[10px] sm:text-xs font-bold text-[#1A1A1A] mb-1.5 sm:mb-2 tracking-wide">
                      Service Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g: Nail Trimming"
                      value={form.name}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className="w-full h-9 sm:h-10 md:h-11 px-3 sm:px-4 bg-white rounded-xl border-none outline-none text-[12px] sm:text-[13px] text-[#1A1A1A] placeholder-[#C2C2C2] focus:ring-2 focus:ring-[#FF6B35]/20 transition-all"
                    />
                  </div>

                  <div className="mb-3 sm:mb-4">
                    <label className="block text-[10px] sm:text-xs font-bold text-[#1A1A1A] mb-1.5 sm:mb-2 tracking-wide">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Short description..."
                      value={form.description}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white rounded-xl border-none outline-none text-[12px] sm:text-[13px] text-[#1A1A1A] placeholder-[#C2C2C2] focus:ring-2 focus:ring-[#FF6B35]/20 resize-none transition-all"
                    />
                  </div>

                  <div className="mb-3 sm:mb-4 flex items-center justify-between">
                    <label className="text-[10px] sm:text-xs font-bold text-[#1A1A1A] tracking-wide">
                      Active
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({ ...prev, active: !prev.active }))
                      }
                      className={`w-9 h-5 sm:w-11 sm:h-6 rounded-full flex items-center px-0.5 sm:px-1 transition-all duration-300 cursor-pointer ${
                        form.active ? "bg-[#FF6B35]" : "bg-gray-200"
                      }`}
                    >
                      <motion.div
                        animate={{
                          x: form.active
                            ? window.innerWidth < 640
                              ? 16
                              : 20
                            : 0,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-white rounded-full shadow"
                      />
                    </button>
                  </div>

                  <div className="mb-4 sm:mb-5">
                    <label className="block text-[10px] sm:text-xs font-bold text-[#1A1A1A] mb-1.5 sm:mb-2 tracking-wide">
                      Image
                    </label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-20 sm:h-24 bg-white rounded-xl border-2 border-dashed border-[#FFD5C5] flex flex-col items-center justify-center cursor-pointer hover:border-[#FF6B35] hover:bg-[#FFF6F3] transition-all overflow-hidden"
                    >
                      {form.previewUrl ? (
                        <img
                          src={form.previewUrl}
                          alt="preview"
                          className="h-full object-contain"
                        />
                      ) : (
                        <>
                          <Upload
                            size={15}
                            className="text-[#FF6B35] mb-1 sm:hidden"
                          />
                          <Upload
                            size={18}
                            className="text-[#FF6B35] mb-1 hidden sm:block"
                          />
                          <span className="text-[10px] sm:text-[11px] text-gray-400">
                            Click to upload image
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={
                      isSaving || !form.name.trim() || !form.description.trim()
                    }
                    className="w-full h-9 sm:h-10 md:h-11 bg-[#FF6B35] disabled:opacity-50 text-white rounded-xl text-[10px] sm:text-xs font-bold hover:bg-[#E25A27] transition-all cursor-pointer shadow-md tracking-wider uppercase flex items-center justify-center gap-1.5 sm:gap-2"
                  >
                    {isSaving ? (
                      <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                    ) : (
                      <Check
                        size={13}
                        strokeWidth={2.5}
                        className="sm:hidden"
                      />
                    )}
                    {!isSaving && (
                      <Check
                        size={15}
                        strokeWidth={2.5}
                        className="hidden sm:block"
                      />
                    )}
                    {isSaving
                      ? "Saving..."
                      : editingCategory
                        ? "Update Category"
                        : "Save Category"}
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default ManageCategory;
