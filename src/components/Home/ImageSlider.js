import {useState} from "react"
import {AiOutlineArrowLeft,AiOutlineArrowRight} from 'react-icons/ai'
const ImageSlider = ({
    slides
}) => {
    const [currentIndex,setCurrentIndex] = useState(0);

    const slideLeft = () => {
        if(currentIndex === 0) {
            return setCurrentIndex(slides.length - 1)
        }
        setCurrentIndex(currentIndex - 1)
    }
    const slideRight = () => {
        if(currentIndex === slides.length - 1){
            return setCurrentIndex(0);
        }
        setCurrentIndex(currentIndex + 1)
    }

    return (
        <div className="h-[100%] relative">
            <AiOutlineArrowLeft onClick={slideLeft} color={'white'} size={100} className="absolute left-1 mt-[25%] z-10 rounded-lg cursor-pointer opacity-90 hover:opacity-50"/>
            <AiOutlineArrowRight onClick={slideRight} color={'white'} size={100} className="absolute right-1 mt-[25%] z-10 rounded-lg cursor-pointer opacity-90 hover:opacity-50"/>
            <div className="w-[100%] h-[100%] rounded-3xl bg-center bg-cover" style={{backgroundImage:`url(${slides[currentIndex].url})`}}></div>
        </div>
    )
}
export default ImageSlider;