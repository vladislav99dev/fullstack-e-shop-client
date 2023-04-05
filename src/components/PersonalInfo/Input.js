const Input = ({
    labelName,
    defaultValue,
    changeState,
    type
    }) => {
    return (
        <>
    <div className="flex justify-center">
        < label className="w-[35%] text-center z-10 rounded-3xl bg-green-200 ">{labelName}</label>
    </div>
    <div className="flex justify-center -mt-2">
        <input onBlur={changeState} type={type ? type : 'text'} className="w-[50%] border-2 border-[#00df9a] py-[0.25rem] rounded-lg hover:border-green-200 text-center" defaultValue={defaultValue ? defaultValue : ''} />
    </div>
        </>

    )
}
export default Input