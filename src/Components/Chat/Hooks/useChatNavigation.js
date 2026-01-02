import { useNavigate } from "react-router-dom";
import { PROJECT_ID } from "../../../APIs";
import { normalizeNavigationTarget } from "../Utils/navigation";

/**
 * Hook to handle navigation logic for the chat interface.
 * Provides a function to navigate to a target with normalization.
 */
export const useChatNavigation = () => {
    const navigate = useNavigate();

    const navigateToTarget = (target) => {
        if (!target) {
            console.warn("🧭 No target provided to navigateToTarget");
            return;
        }
        try {
            const normalizedTarget = normalizeNavigationTarget(target, PROJECT_ID);
            if (normalizedTarget.startsWith("http")) {
                window.open(normalizedTarget, "_blank");
            } else {
                navigate(normalizedTarget);
            }
        } catch (error) {
            console.error("❌ Error during chat navigation:", error);
            console.error("❌ Target that caused error:", target);
        }
    };

    return { navigateToTarget };
};