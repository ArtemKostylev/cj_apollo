import React from 'react';
import {Layout} from './Layout';
import {ProvideMidtermExam, useMidtermExamContext} from './useMidtermExamContext';
import ReactModal from 'react-modal';
import {Spinner} from '../../../shared/ui/Spinner';

export const MidtermExam = () => {
  const {modalOpened, onClose, loading, error} = useMidtermExamContext();

  if (loading) return <Spinner/>
  if (error) throw new Error('503')

  return (
    <Layout>
      <ReactModal isOpen={modalOpened}
                  className='modal'
                  overlayClassName='overlay'>

      </ReactModal>
    </Layout>
  )
}