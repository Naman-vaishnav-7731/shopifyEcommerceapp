import {Button, Modal, TextContainer} from '@shopify/polaris';
import {useState, useCallback} from 'react';
import CustomerEdit from './CustomerEdit';

function CustomerModal({handleModal , active}) {

  return (
    <div>
      <Modal
        open={active}
        onClose={handleModal}
        title="Customers Profile"
        primaryAction={{
          content: 'Close',
          onAction: handleModal,
        }}
      >
        <Modal.Section>
           <CustomerEdit />
        </Modal.Section>
      </Modal>
    </div>
  );
}

export default CustomerModal;