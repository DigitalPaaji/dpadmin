import React from 'react';

const PopupModal = ({
  title ,
  
  onCancel,
  onConfirm,
  confirmText,
  cancelText,
  type, // options: default | delete | warning | info
  
}) => {
  const getConfirmButtonColor = () => {
    switch (type) {
      case 'delete':
        return 'bg-red-500 hover:bg-red-600';
      case 'warning':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'info':
        return 'bg-blue-500 hover:bg-blue-600';
      default:
        return 'bg-green-500 hover:bg-green-600';
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-[#4d4c4b54] bg-opacity-30 z-[9999]"
    >
      <div className="bg-white rounded-xl shadow-md p-6 mx-4 sm:mx-12 max-w-md w-full">
        <h2 className="text-lg font-medium text-gray-700">{title}</h2>
        

        <div className="flex justify-end mt-6 gap-3">
          
            <button
              className="bg-[#5f5e5e] cursor-pointer text-white px-3 py-1 rounded hover:bg-[#333232] transition"
              onClick={()=>{onCancel()}}
            >
              {cancelText}
            </button>
         
          <button
            className={`${getConfirmButtonColor()} bg-[#dd4747e7] text-white cursor-pointer px-3 py-1 rounded hover:bg-[#ec4242e7] transition`}
            onClick={()=>{onConfirm()}}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupModal;