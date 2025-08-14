import React from 'react';

interface TabButtonProps {
  id: number;
  name: string;
  isSelected: boolean;
  onClick: (id: number) => void;
  activeColor?: string;
}

const TabButton: React.FC<TabButtonProps> = ({ 
    id,
    name,
    isSelected,
    onClick,
    activeColor = '#007bff'
}) => {
    return (
        <button
            onClick={() => onClick(id)}
            type="button"
            style={{
            padding: '10px 20px',
            border: 'none',
            borderBottom: isSelected ? `3px solid ${activeColor}` : '3px solid transparent',
            backgroundColor: isSelected ? '#f8f9fa' : 'transparent',
            color: isSelected ? activeColor : '#666',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: isSelected ? 'bold' : 'normal',
            transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
            if (!isSelected) {
            e.currentTarget.style.backgroundColor = '#f1f3f4';
            }
        }}
        onMouseLeave={(e) => {
            if (!isSelected) {
                e.currentTarget.style.backgroundColor = 'transparent';
            }
        }}
        >
        {name}
        </button>
    );
};

export default TabButton;