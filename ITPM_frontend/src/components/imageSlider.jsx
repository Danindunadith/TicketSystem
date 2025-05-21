import { useState } from "react";

export default function ImageSlider(props) {
    const images = props.images;
    const [selectedImage, setSelectedImage] = useState(images[0]);
    
    return (
        <div className="w-full flex flex-col items-center  ">
            <img 
                src={selectedImage} 
                alt="product" 
                className="w-full h-96 object-contain "
            />

            {/* Selected Image Thumbnails */}

            {/*<div className="w-full flex justify-center mt-4 overflow-x-auto">
                {images.map((image, index) => (
                    <img 
                        key={index} 
                        src={image} 
                        alt="product thumbnail" 
                        className={`w-20 h-20 object-cover cursor-pointer mx-1 ${image === selectedImage ? "border-2 border-accent" : "border border-gray-200"}`} 
                        onClick={() => setSelectedImage(image)} 
                    />
                ))}
            </div>*/}
        </div>
    );
}