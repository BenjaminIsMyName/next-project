export default function Button(props) {
  const { children } = props;
  let copyOfProps = { ...props };
  delete copyOfProps.children;
  delete copyOfProps.className;

  // overflow-hidden - solves bug when red line is overflowing
  return (
    <button
      onMouseDown={e => e.preventDefault()} // solves bug when clicking a button and losing focus from input with error, see: https://stackoverflow.com/a/57630197/19460851
      className={`bg-main-color p-2 text-third-color cursor-pointer transition-all duration-500 border-0 rounded-3xl shadow-[0_0_8px_rgba(var(--option-text-color),0.2)] 
      text-2xl relative 
      overflow-hidden 
      disabled:bg-main-color disabled:bg-opacity-70 disabled:cursor-not-allowed disabled:rounded-none disabled:shadow-none disabled:opacity-60
      disabled:before:content-[""] disabled:before:absolute disabled:before:w-full disabled:before:h-1 
      disabled:before:opacity-0 disabled:before:top-2/4 disabled:before:right-0 
      disabled:before:rotate-[350deg] disabled:before:scale-x-75 disabled:before:-translate-y-1/2
      disabled:before:-z-10 disabled:before:rounded-3xl disabled:before:bg-error-color 
      disabled:before:bg-opacity-60 disabled:before:transition-all disabled:before:duration-200
      hover:shadow-[0_0_5px_2px_rgba(var(--shadows-color),_0.2)]
      disabled:hover:before:opacity-100
      
      ${props.className || ""}`}
      {...copyOfProps}
    >
      <span className="bg-gradient-to-r from-third-color to-option-text-color bg-clip-text text-opacity-0">
        {children}
      </span>
    </button>
  );
}
