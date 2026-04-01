import React, { useState } from 'react';
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

interface ImageZoomProps {
    src: string;
    alt?: string;
}

const ImageZoom: React.FC<ImageZoomProps> = ({ src, alt }) => {
    const [visible, setVisible] = useState(false);

    return (
        <>
            <img 
                src={src} 
                alt={alt}
                className="cursor-pointer max-w-full hover:opacity-90 transition-opacity"
                onClick={() => setVisible(true)}
                style={{ 
                    maxWidth: '100%',
                    cursor: 'pointer'
                }}
            />
            {visible && (
                <div 
                    className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
                    onClick={() => setVisible(false)}
                >
                    <div 
                        className="relative w-full h-full flex items-center justify-center p-4"
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    >
                        <button 
                            className="absolute top-4 right-4 text-white text-3xl z-50 p-2 hover:text-gray-300 transition-colors"
                            onClick={() => setVisible(false)}
                            aria-label="关闭"
                        >
                            ×
                        </button>
                        <TransformWrapper
                            initialScale={1}
                            minScale={0.5}
                            maxScale={5}
                            limitToBounds={false}
                            wheel={{ step: 0.1 }}
                            pinch={{ step: 1 }}
                            doubleClick={{ disabled: true }}
                        >
                            <TransformComponent>
                                <img 
                                    src={src} 
                                    alt={alt}
                                    style={{ 
                                        maxWidth: '100%',
                                        maxHeight: '80vh',
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
            )}
        </>
    );
};

export default ImageZoom;
