import { Response } from "express"; 

const checkPasswordStrength = (res: Response, password: string) => {
    const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(password);
    return passwordRegex;
        
};



// Helper function to handle password strength check
const handlePasswordStrength = (res: Response, password: string): boolean => {
    if (!checkPasswordStrength(res, password)) {
        res.status(400).json({ message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character. "});
        return false;
    }
    return true;
};

export default handlePasswordStrength;