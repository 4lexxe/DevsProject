import { useState } from 'react';
import { COMPONENTS } from '../constants/panel-left.constants';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';

interface MenuItem {
    label: string;
    icon: React.ElementType;
}

interface MenuSection {
    title: string;
    items: MenuItem[];
}

const Sidebar: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);

    // Organize items into sections
    const menuSections: MenuSection[] = [
        {
            title: "General",
            items: [COMPONENTS[0], COMPONENTS[1], COMPONENTS[2]]
        },
        {
            title: "Categorías",
            items: [COMPONENTS[3], COMPONENTS[4]]
        },
        {
            title: "Comunidad",
            items: [COMPONENTS[5], COMPONENTS[6]]
        },
        {
            title: "Configuración",
            items: [COMPONENTS[7]]
        }
    ];

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div 
            className={`bg-gray-800 text-white transition-all duration-300 ease-in-out h-screen ${
                collapsed ? 'w-16' : 'w-64'
            } flex flex-col`}
        >
            <div className="flex justify-end p-2">
                <button 
                    onClick={toggleSidebar}
                    className="p-2 rounded-full hover:bg-gray-700 text-gray-400"
                >
                    {collapsed ? <IoChevronForwardOutline /> : <IoChevronBackOutline />}
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
                {menuSections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="mb-6">
                        {!collapsed && (
                            <h3 className="uppercase text-xs font-bold text-gray-400 px-4 mb-2">
                                {section.title}
                            </h3>
                        )}
                        <ul>
                            {section.items.map((item, itemIndex) => {
                                const IconComponent = item.icon;
                                return (
                                    <li key={itemIndex}>
                                        <a 
                                            href="#" 
                                            className={`flex items-center py-2 px-4 hover:bg-gray-700 rounded-lg mx-2 text-gray-300 hover:text-white ${
                                                collapsed ? 'justify-center' : ''
                                            }`}
                                        >
                                            <IconComponent className={`${collapsed ? 'text-xl' : 'mr-3'}`} />
                                            {!collapsed && <span>{item.label}</span>}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;