import React from 'react';
import TabButton from './TabButton.tsx';

interface TabItem {
    id: number;
    name: string;
}

interface TabContainerProps {
    title: string;
    items: TabItem[];
    selectedId: number | null;
    onItemSelect: (id: number) => void;
    onAddClick: () => void;
    activeColor?: string;
}

const TabContainer: React.FC<TabContainerProps> = ({
    title,
    items,
    selectedId,
    onItemSelect,
    onAddClick,
    activeColor = '#007bff'
}) => {
    return (
        <div>
            <h5>{title}:</h5>
                <div style={{ display: 'flex', borderBottom: '2px solid #ccc', marginBottom: '20px' }}>
                    {items.map((item) => (
                        <TabButton
                            key={item.id}
                            id={item.id}
                            name={item.name}
                            isSelected={selectedId === item.id}
                            onClick={onItemSelect}
                            activeColor={activeColor}
                      />
                    ))}
                <button type="button" onClick={onAddClick}>+</button>
            </div>
        </div>
    );
};

export default TabContainer;