import ImageSlider from "./ImageSlider";

const Home = () => {
    const slides = [
        {url:"https://static.nike.com/a/images/f_auto/dpr_3.0,cs_srgb/h_500,c_limit/f55bf732-7fa9-4b38-8464-3332d97f879a/nike%E2%80%99s-best-casual-shoes-for-everyday-wear.jpg",title:"White Nike"},
        {url:"https://static.nike.com/a/images/w_1920,c_limit/4c8bdb53-49a1-4b03-9b3f-5334e257a8bd/how-to-pick-good-shoes-for-travel.jpg",title:"Travel Nike"},
        {url:"https://static.nike.com/a/images/w_1920,c_limit/92588355-f994-4e77-90e2-6b2883465cdb/the-best-nike-shoes-for-pickleball.jpg",title:"Tenis Nike"},
        {url:"https://static.nike.com/a/images/f_auto/dpr_3.0,cs_srgb/h_500,c_limit/e5853518-be79-4fcc-afe4-6d2df175de53/nike%E2%80%99s-best-casual-shoes-for-everyday-wear.jpg",title:"Black Nike"},
    ]
    return (
        <div>
            <div className="w-[100%] h-[280px] xs:h-[350px]  sm:h-[400px] md:h-[500px]   lg:w-[90%] lg:h-[800px] lg:ml-[5%] 2xl:h-[900px] 3xl:h-[1000px]">
            <ImageSlider slides={slides}/>
            </div>
            <div className="h-300px">Heelo</div>
        </div>
        )
}

export default Home;

