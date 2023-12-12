import React from 'react';


interface DeleteModalProps {
  id: string;
  onDelete: () => void;
  message: string;
  name: string;
  deleteName: string;
  title?: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ id, onDelete, message, name, deleteName, title }) => {
     const sanitizedId = id.replace(/\s+/g, '-').toLowerCase();
  return (
    <>
      <div className="" data-bs-toggle="modal" data-bs-target={`#${sanitizedId}`}>
        {name}
      </div>
      <div className="modal fade not-hidden" id={sanitizedId} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby={`${sanitizedId}Label`} aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              {title ? (
               <h1 className="modal-title fs-5" id={`${sanitizedId}Label`}>{title}</h1>
              ): 
              (
                <h1 className="modal-title fs-5" id={`${sanitizedId}Label`}>Delete Data</h1>
              )}
              <button type="button" className="btn-close not-hidden" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {message}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary not-hidden" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-danger not-hidden" data-bs-dismiss="modal" onClick={onDelete}>{deleteName}</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DeleteModal;
