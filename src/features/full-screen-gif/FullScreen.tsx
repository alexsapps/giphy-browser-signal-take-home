import React from 'react';
import styles from './FullScreen.module.css';

/** Component for rendering content in a full-screen overlay. */
export function FullScreen(props: {
    children: React.ReactNode,
    onClick: (()=>void)
}) {
    return (
        <div className={styles.fullScreenOverlay} onClick={props.onClick}>
            {props.children}
        </div>
    );
}