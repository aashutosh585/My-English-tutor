import React from 'react';

const RoleSelector = ({ roles, selectedRole, onRoleChange, disabled }) => {
    return (
        <div className="relative">
            <select
                value={selectedRole}
                onChange={(e) => onRoleChange(e.target.value)}
                disabled={disabled}
                className="block appearance-none w-full max-w-[120px] bg-white border border-gray-300 hover:border-gray-400 pl-3 pr-8 py-1.5 rounded-full shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 truncate"
                aria-label="Select a role"
            >
                {roles.map((role) => (
                    <option key={role} value={role}>
                        {role}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
        </div>
    );
};

export default RoleSelector;
