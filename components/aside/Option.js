import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

export default function Option({ text, link, onClick, icon, newTab }) {
  const IconComponent = icon();
  const router = useRouter();
  const isSelected = router.route === link;
  return (
    <Link href={link} scroll={false}>
      <a
        target={newTab ? "_blank" : "_self"}
        onClick={onClick}
        className={`first-of-type:mt-5 rounded-e-full block w-[90%]
        my-[5px] mx-auto py-[13px] px-[20px]
        text-option-text-color md:text-[1.3rem] text-[1rem] no-underline relative
        transition[font-size] duration-500 ease-[ease]
        
        ${
          isSelected
            ? "text-third-color"
            : `before:content-[''] before:absolute before:inset-0 -z-10 
        before:bg-main-color/50 before:scale-y-100 before:scale-x-0 before:transition-all 
        before:duration-500 before:ease-[ease] 
        before:ltr:origin-left before:rtl:origin-right rounded-none
        opacity-50 hover-when-supported:hover:before:scale-x-100 hover-when-supported:hover:before:rounded-e-full
       active:bg-main-color`
        }

       ${isSelected ? "[&_svg]:animate-go-in" : ""} `}
      >
        <div
          className={`z-50 flex gap-5 relative items-center [&_svg]:w-[25px] [&_svg]:h-[25px] md:[&_svg]:w-[35px] md:[&_svg]:h-[35px]
        [&_svg]:transition-all [&_svg]:duration-500 [&_svg]:ease-[ease] ${
          isSelected
            ? "[&_svg]:fill-third-color"
            : "[&_svg]:fill-option-text-color"
        }`}
        >
          <IconComponent />
          <span>{text}</span>
        </div>
        {router.route === link && (
          <motion.div
            layoutId="selected"
            className="absolute inset-0 bg-main-color z-10 rounded-e-full"
          ></motion.div>
        )}
      </a>
    </Link>
  );
}
