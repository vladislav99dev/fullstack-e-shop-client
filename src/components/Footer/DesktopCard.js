import { BiPlus, BiMinus } from "react-icons/bi";

const DesktopCard = ({ titleName, services,state,clickHandler }) => {

  const defaultListStyles = 'lg:flex lg:flex-col lg:items-start mt-10 lg:mt-2'

  return (
    <div onClick={clickHandler}
      className="
      hover:cursor-pointer 
      flex
      justify-between
      font-semibold
      text-white
      bg-primary-dark-400
      px-2
      py-4
      lg:block
      lg:bg-inherit
      lg:text-lg
      lg:py-0
      lg:text-primary-dark-200
      "
    >
      {titleName}
      <ul className={state ? `${defaultListStyles} text-lg` : `${defaultListStyles} hidden`}>
        {services.map((x, index) => (
          <li
            key={index}
            className=" text-white font-normal text-base hover:cursor-pointer hover:text-green-200 py-2 lg:py-0"
          >
            {x}
          </li>
        ))}
      </ul>
      <BiPlus size={35} className="lg:hidden" />
    </div>
  );
};
export default DesktopCard;
