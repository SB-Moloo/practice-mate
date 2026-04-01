import React, { useState, useEffect } from 'react';
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

interface ImageZoomProps {
    src: string;
    alt?: string;
}

const ImageZoom: React.FC<ImageZoomProps> = ({ src, alt }) => {
    const [visible, setVisible] = useState(false);

    // 当 src 变化时，自动关闭预览
    useEffect(() => {
        setVisible(false);
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

    return (
        <>
            <img 
                src={src} 
                alt={alt}
                onClick={() => setVisible(true)}
                style={{ 
                    maxWidth: '100%',
                    cursor: 'pointer'
                }}
                className="max-w-full hover:opacity-90 transition-opacity"
            />
            {visible && (
                <div 
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center overflow-hidden"
                    onClick={() => setVisible(false)}
                >
                    <div 
                        className="w-full h-full relative"
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
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
            )}
        </>
    );
};

export default ImageZoom;
