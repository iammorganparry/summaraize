import { useEffect } from "react";

type UseBackgroundMessagesProps = {
  onTabChanged: () => void;
};

export const useBackgroundMessages = ({
  onTabChanged,
}: UseBackgroundMessagesProps) => {
  useEffect(() => {
    chrome.runtime.onMessage.addListener(
      (message: { tabChanged: boolean; title: string }) => {
        if (message.tabChanged === true) {
          onTabChanged();
        }
      }
    );
  }, [onTabChanged]);
};
