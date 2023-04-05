import { Link } from "react-router-dom";
const ErrorPage = () => {
  return (
    <div className="flex justify-center mt-20">
      <section className="w-[300vh] flex justify-center page_404">
        <div className="container">
          <div className="row">
            <div className="col-sm-12 ">
              <div className="col-sm-10 col-sm-offset-1  text-center">
                <div className="four_zero_four_bg rounded-lg">
                  <h1 className="text-center font-semibold text-[#00df9a]">404</h1>
                </div>

                <div className="contant_box_404">
                  <p className="text-lg font-semibold text-[#00df9a]">Looks like you're lost</p>

                  <p className="text-lg font-semibold text-[#00df9a]">the page you are looking for not found!</p>

                  <Link to={'/products/all'} className="link_404 rounded-md font-semibold bg-[#DDDDDD] hover:bg-[#00df9a] ease-in-out duration-300">
                    Go to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ErrorPage;
