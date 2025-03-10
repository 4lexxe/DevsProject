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
    const [activeItem, setActiveItem] = useState<string | null>(null);

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

    const handleItemClick = (label: string) => {
        setActiveItem(label === activeItem ? null : label);
    };

    return (
        <div 
            className={`blue-50  transition-all duration-300 ease-in-out h-screen ${
                collapsed ? 'w-16' : 'w-64'
            } flex flex-col border-r border-gray-200`}
        >
            <div className="flex justify-end p-2">
                <button 
                    onClick={toggleSidebar}
                    className="p-2 rounded-full hover:bg-blue-400/30 text-gray-600 hover:text-blue-400 transition-colors"
                >
                    {collapsed ? <IoChevronForwardOutline /> : <IoChevronBackOutline />}
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
                {menuSections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="mb-6">
                        {!collapsed && (
                            <h3 className="uppercase text-xs font-bold text-gray-500 px-4 mb-2 tracking-wider">
                                {section.title}
                            </h3>
                        )}
                        <ul>
                            {section.items.map((item, itemIndex) => {
                                const IconComponent = item.icon;
                                const isActive = activeItem === item.label;
                                return (
                                    <li key={itemIndex}>
                                        <button
                                            onClick={() => handleItemClick(item.label)}
                                            className={`w-full flex items-center py-2.5 px-4 rounded-lg mx-2 transition-all duration-200 ${
                                                collapsed ? 'justify-center' : ''
                                            } ${
                                                isActive 
                                                    ? 'bg-blue-600 text-white shadow-lg'
                                                    : 'text-gray-500 hover:bg-blue-400/30 hover:text-blue-500'
                                            }`}
                                        >
                                            <IconComponent className={`${collapsed ? 'text-xl' : 'mr-3'} ${isActive ? 'text-blue-400' : ''}`} />
                                            {!collapsed && <span className="text-sm">{item.label}</span>}
                                        </button>
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