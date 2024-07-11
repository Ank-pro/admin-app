import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import './modal.css';

export function Modal({children,open,onClose}){
    const dialog = useRef()
    useEffect(()=>{
        const modal = dialog.current;
        if(open){
            modal.showModal();
        }else{
            modal.close();
        }
    },[open])

    return createPortal(
    <dialog className="modal" ref={dialog} onClose={onClose}>
        <div className="modal-content">
        {children}
        <button className="close-button" onClick={onClose}>X</button>
        </div>
        </dialog>,
    document.getElementById('modal')
    );
}