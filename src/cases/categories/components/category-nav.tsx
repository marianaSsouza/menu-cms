import { Link } from "react-router-dom";
import { useCategories } from "../hooks/use-category";
import { cn } from "cn";
import { Utensils } from "lucide-react";

export function CategoryNav() {

    const { data: categories = []} = useCategories()


    return (
        <nav className= "w-full">

        <ul className="overflow-hidden rounded-xl boder border-border/70 bg-transparent">
        
        {categories.map((category) => (
            <li key = {category.id}
            className="relative"
            >
                
            <Link
            to={`/products?categoryId=${category.id}`}
            className={cn(
                'relative flex w-full items-center px-5 py-5',
                'font-menu text-lg font-semibold uppercase tracking-tight',
                'border-xl border border-transparent',
                'transition-colors duration-200',
                'hover:z-10 hover:text-[#B86A2C]'
            )}

            >
             {category.icon ? (
                <span>ICON</span>
            
            ) : (
                <Utensils className="size-10 text-brand"> </Utensils>
            )}



             <span className="leading-tight">{category.name}</span>
            </Link>    
                
            </li>
        ))}


        </ul>
        </nav>
    )
}