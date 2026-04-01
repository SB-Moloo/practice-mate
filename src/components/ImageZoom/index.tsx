import React, { useState, useEffect, useRef } from 'react';
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { createPortal } from 'react-dom';

interface ImageZoomProps {
    src: string;
    alt?: string;
}

const ImageZoom: React.FC<ImageZoomProps> = ({ src, alt }) => {
    const [visible, setVisible] = useState(false);
    const prevSrcRef = useRef<string>('');

    // 处理点击事件
    const handleClick = () => {
        setVisible(true);
    }

    // 监听 src 变化来关闭预览（只在 src 实际变化且当前是打开状态时）
    useEffect(() => {
        if (visible && prevSrcRef.current && prevSrcRef.current !== src) {
            setVisible(false);
        }
        prevSrcRef.current = src;
    }, [src]);

    // 阻止背景滚动
    useEffect(() => {
        if (visible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [visible]);

    // 渲染预览弹窗（使用 Portal）
    const renderPreview = () => {
        if (!visible) return null;
        
        return (
            <div 
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center overflow-hidden"
                onClick={() => setVisible(false)}
                data-debug="preview-overlay"
            >
                <div 
                    className="w-full h-full relative"
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    data-debug="preview-container"
                >
                    <button 
                        className="absolute top-4 right-4 text-white text-4xl z-[60] p-2 hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
                        onClick={() => setVisible(false)}
                        aria-label="关闭"
                    >
                        ×
                    </button>
                    <div className="w-full h-full flex items-center justify-center">
                        <TransformWrapper
                            initialScale={1}
                            minScale={0.1}
                            maxScale={10}
                            limitToBounds={false}
                            wheel={{ step: 0.1 }}
                            pinch={{ step: 1 }}
                            doubleClick={{ disabled: true }}
                            centerOnInit={true}
                            alignmentAnimation={{ disabled: false }}
                        >
                            <TransformComponent>
                                <img 
                                    src={src} 
                                    alt={alt}
                                    style={{ 
                                        maxWidth: '100vw',
                                        maxHeight: '100vh',
                                        objectFit: 'contain',
                                        cursor: 'grab',
                                        userSelect: 'none'
                                    }}
                                    draggable={false}
                                />
                            </TransformComponent>
                        </TransformWrapper>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <img 
                src={src} 
                alt={alt}
                onClick={handleClick}
                style={{ 
                    maxWidth: '100%',
                    cursor: 'pointer'
                }}
                className="max-w-full hover:opacity-90 transition-opacity"
            />
            {/* 使用 Portal 将预览窗口渲染到 body 下 */}
            {createPortal(renderPreview(), document.body)}
        </>
    );
};

export default ImageZoom;
