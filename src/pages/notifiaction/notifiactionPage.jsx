import React, { useEffect } from "react"; // Import useEffect
import { useNotification } from "../../context/notificationContext";
import moment from "moment";

const NotificationPage = () => {
  // Get markAsRead from context too!
  const { notifications, markAsRead } = useNotification();

  // 1. Mark all as read automatically when this page opens
  useEffect(() => {
    markAsRead();
  }, []); 

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Notifications</h1>
        </div>

        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>You're all caught up! No new notifications.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {notifications.map((notif, index) => (
              <li 
                key={index} 
                // FIX 1: Use 'isRead' instead of 'read'
                className={`p-4 hover:bg-gray-50 transition cursor-pointer ${!notif.isRead ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <img 
                      className="h-10 w-10 rounded-full object-cover" 
                      // FIX 2: Access sender.profileImage (nested object)
                      // Fallback to a placeholder if image is missing
                      src={notif.sender?.profileImage || "https://via.placeholder.com/40"} 
                      alt="Avatar" 
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {/* FIX 3: Use 'message' instead of 'content' */}
                      {notif.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {moment(notif.createdAt).fromNow()}
                    </p>
                  </div>
                  
                  {/* FIX 4: Use 'isRead' */}
                  {!notif.isRead && (
                    <div className="flex-shrink-0 self-center">
                      <span className="block h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;