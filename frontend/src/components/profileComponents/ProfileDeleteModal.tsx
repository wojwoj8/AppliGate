import React from 'react';
import Icon from '@mdi/react';
import { mdiDelete } from '@mdi/js'

interface ProfileDeleteModalProps {
  id: string;
  onDelete: () => void;
}

const ProfileDeleteModal: React.FC<ProfileDeleteModalProps> = ({ id, onDelete }) => {
     const sanitizedId = id.replace(/\s+/g, '-').toLowerCase();
  return (
    <>
      <div className="profile-svgs" data-bs-toggle="modal" data-bs-target={`#${sanitizedId}`}>
        <Icon path={mdiDelete} size={1} />
      </div>

      <div className="modal fade" id={sanitizedId} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby={`${sanitizedId}Label`} aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id={`${sanitizedId}Label`}>Delete Data</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              Are you sure you want to delete this data?
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={onDelete}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileDeleteModal;
