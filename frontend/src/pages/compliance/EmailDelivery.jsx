 import React, { useEffect, useMemo, useState } from "react";
 import axiosInstance from "../../api/axiosInstance";
 
 import {
   AlertCircle,
   CheckCircle2,
   Clock3,
   Mail,
   RefreshCw,
   Search,
   Send,
   X,
   XCircle,
   Eye,
   Filter,
 } from "lucide-react";
 
 const EmailDelivery = () => {
   // =========================================================
   // STATE
   // =========================================================
 
   const [notifications, setNotifications] = useState([]);
 
   const [stats, setStats] = useState({
     total: 0,
     sent: 0,
     failed: 0,
     unread: 0,
   });
 
   const [loading, setLoading] = useState(true);
   const [refreshing, setRefreshing] = useState(false);
 
   const [search, setSearch] = useState("");
   const [statusFilter, setStatusFilter] = useState("ALL");
   const [reminderFilter, setReminderFilter] = useState("ALL");
 
   const [selectedNotification, setSelectedNotification] = useState(null);
   const [showDetails, setShowDetails] = useState(false);
 
   // =========================================================
   // RESEND STATE
   // =========================================================
 
   const [resendingId, setResendingId] = useState(null);
   const [showResendModal, setShowResendModal] = useState(false);
   const [notificationToResend, setNotificationToResend] = useState(null);
 
   // ======================
   // Delete State
   const [deletingSent, setDeletingSent] = useState(false);
 const [showDeleteSentModal, setShowDeleteSentModal] = useState(false);
 
 const [deleteSuccess, setDeleteSuccess] = useState("");
 const [deleteError, setDeleteError] = useState("");
   // ==================
 
   // =========================================================
   // RESULT MESSAGE STATE
   // =========================================================
 
   const [resendSuccess, setResendSuccess] = useState("");
   const [resendError, setResendError] = useState("");
 
   const [error, setError] = useState("");
 
   // =========================================================
   // FETCH EMAIL DELIVERY DATA
   // =========================================================
 
   const fetchEmailDelivery = async (showLoader = true) => {
     try {
       if (showLoader) {
         setLoading(true);
       } else {
         setRefreshing(true);
       }
 
       setError("");
 
       const params = {};
 
       if (statusFilter !== "ALL") {
         params.status = statusFilter;
       }
 
       if (reminderFilter !== "ALL") {
         params.reminderType = reminderFilter;
       }
 
       if (search.trim()) {
         params.search = search.trim();
       }
 
       const response = await axiosInstance.get("/api/email-delivery", {
         params,
       });
 
       if (response.data?.success) {
         setNotifications(response.data.notifications || []);
 
         setStats(
           response.data.stats || {
             total: 0,
             sent: 0,
             failed: 0,
             unread: 0,
           }
         );
       } else {
         setError(
           response.data?.message ||
             "Failed to fetch email delivery records."
         );
       }
     } catch (err) {
       console.error("Email delivery fetch error:", err);
 
       setError(
         err.response?.data?.message ||
           "Unable to load email delivery records."
       );
     } finally {
       setLoading(false);
       setRefreshing(false);
     }
   };
 
   // =========================================================
   // INITIAL LOAD + FILTER CHANGE
   // =========================================================
 
   useEffect(() => {
     const timer = setTimeout(() => {
       fetchEmailDelivery();
     }, 300);
 
     return () => clearTimeout(timer);
   }, [statusFilter, reminderFilter, search]);
 
   // =========================================================
   // MANUAL REFRESH
   // =========================================================
 
   const handleRefresh = () => {
     fetchEmailDelivery(false);
   };
   const handleDeleteAllSent = async () => {
   try {
     setDeletingSent(true);
 
     setDeleteSuccess("");
     setDeleteError("");
 
     const response = await axiosInstance.delete(
       "/api/email-delivery/sent"
     );
 
     if (response.data?.success) {
       setShowDeleteSentModal(false);
 
       setDeleteSuccess(
         response.data?.message ||
           "Successfully sent notifications deleted."
       );
 
       await fetchEmailDelivery(false);
 
       setTimeout(() => {
         setDeleteSuccess("");
       }, 3000);
 
       return;
     }
 
     setDeleteError(
       response.data?.message ||
         "Failed to delete sent notifications."
     );
 
     setTimeout(() => {
       setDeleteError("");
     }, 3000);
   } catch (err) {
     console.error(
       "Delete sent notifications error:",
       err
     );
 
     setShowDeleteSentModal(false);
 
     setDeleteError(
       err.response?.data?.message ||
         "Failed to delete sent notifications."
     );
 
     setTimeout(() => {
       setDeleteError("");
     }, 3000);
   } finally {
     setDeletingSent(false);
   }
 };
 
   // =========================================================
   // OPEN DETAILS
   // =========================================================
 
   const handleViewDetails = (notification) => {
     setSelectedNotification(notification);
     setShowDetails(true);
   };
 
   // =========================================================
   // CLOSE DETAILS
   // =========================================================
 
   const closeDetails = () => {
     if (resendingId !== null) {
       return;
     }
 
     setShowDetails(false);
     setSelectedNotification(null);
   };
 
   // =========================================================
   // OPEN RESEND CONFIRMATION
   // =========================================================
 
   const handleResendClick = (notification) => {
     if (!notification || notification.emailStatus !== "FAILED") {
       return;
     }
 
     setNotificationToResend(notification);
     setShowResendModal(true);
   };
 
   // =========================================================
   // CLOSE RESEND MODAL
   // =========================================================
 
   const closeResendModal = () => {
     if (resendingId !== null) {
       return;
     }
 
     setShowResendModal(false);
     setNotificationToResend(null);
   };
 
   // =========================================================
   // RESEND FAILED EMAIL
   // =========================================================
 
   const handleConfirmResend = async () => {
     if (!notificationToResend?._id) {
       return;
     }
 
     const notificationId = notificationToResend._id;
 
     try {
       // -------------------------------------------------------
       // START RESEND
       // -------------------------------------------------------
 
       setResendingId(notificationId);
 
       // Clear previous result messages
       setResendSuccess("");
       setResendError("");
 
       // Close details drawer if it is open
       setShowDetails(false);
 
       // -------------------------------------------------------
       // CALL BACKEND
       // -------------------------------------------------------
 
       const response = await axiosInstance.post(
         `/api/email-delivery/${notificationId}/resend`
       );
 
       // -------------------------------------------------------
       // SUCCESS
       // -------------------------------------------------------
 
       if (response.data?.success) {
         setShowResendModal(false);
         setNotificationToResend(null);
         setSelectedNotification(null);
 
         setResendSuccess(
           response.data?.message ||
             "Email resent successfully."
         );
 
         // Refresh records silently so the updated
         // notification status is shown.
         await fetchEmailDelivery(false);
 
         // Keep success message visible for 2 seconds.
         setTimeout(() => {
           setResendSuccess("");
         }, 2000);
 
         return;
       }
 
       // -------------------------------------------------------
       // FAILED RESPONSE
       // -------------------------------------------------------
 
       setShowResendModal(false);
       setNotificationToResend(null);
       setSelectedNotification(null);
 
       setResendError(
         response.data?.message ||
           "Email resend failed after 3 attempts."
       );
 
       // Refresh records silently so the FAILED status
       // and latest attempt information are displayed.
       await fetchEmailDelivery(false);
 
       setTimeout(() => {
         setResendError("");
       }, 3000);
     } catch (err) {
       console.error("Resend email error:", err);
 
       // -------------------------------------------------------
       // FAILED REQUEST
       // -------------------------------------------------------
 
       setShowResendModal(false);
       setNotificationToResend(null);
       setSelectedNotification(null);
 
       setResendError(
         err.response?.data?.message ||
           "Email resend failed after 3 attempts."
       );
 
       // Refresh the table even when Axios receives
       // HTTP 500 from the backend.
       await fetchEmailDelivery(false);
 
       setTimeout(() => {
         setResendError("");
       }, 3000);
     } finally {
       setResendingId(null);
     }
   };
 
   // =========================================================
   // CLEAR FILTERS
   // =========================================================
 
   const clearFilters = () => {
     setSearch("");
     setStatusFilter("ALL");
     setReminderFilter("ALL");
   };
 
   // =========================================================
   // HELPER FUNCTIONS
   // =========================================================
 
   const getVendorName = (notification) => {
     if (!notification?.vendorId) {
       return "Unknown Vendor";
     }
 
     return (
       notification.vendorId.companyName ||
       notification.vendorId.name ||
       "Unknown Vendor"
     );
   };
 
   const getVendorEmail = (notification) => {
     return (
       notification?.email ||
       notification?.vendorId?.email ||
       "No email"
     );
   };
 
   const getDocumentName = (notification) => {
     const document = notification?.documentId;
 
     if (!document) {
       return "Document";
     }
 
     return (
       document.documentTypeId?.name ||
       document.documentTypeId?.documentName ||
       "Document"
     );
   };
 
   const getReminderLabel = (reminderType) => {
     const labels = {
       "15_DAY": "15 Days Before",
       "7_DAY": "7 Days Before",
       "1_DAY": "1 Day Before",
       EXPIRED_1_DAY: "1 Day Expired",
       EXPIRED_3_DAY: "3 Days Expired",
       EXPIRED_7_DAY: "7 Days Expired",
     };
 
     return labels[reminderType] || reminderType || "Unknown";
   };
 
   const formatDate = (date) => {
     if (!date) {
       return "—";
     }
 
     const parsedDate = new Date(date);
 
     if (Number.isNaN(parsedDate.getTime())) {
       return "—";
     }
 
     return parsedDate.toLocaleString("en-IN", {
       day: "2-digit",
       month: "short",
       year: "numeric",
       hour: "2-digit",
       minute: "2-digit",
     });
   };
 
   const formatShortDate = (date) => {
     if (!date) {
       return "—";
     }
 
     const parsedDate = new Date(date);
 
     if (Number.isNaN(parsedDate.getTime())) {
       return "—";
     }
 
     return parsedDate.toLocaleDateString("en-IN", {
       day: "2-digit",
       month: "short",
       year: "numeric",
     });
   };
 
   // =========================================================
   // LOCAL SEARCH FALLBACK
   // =========================================================
 
   const filteredNotifications = useMemo(() => {
     if (!search.trim()) {
       return notifications;
     }
 
     const value = search.toLowerCase().trim();
 
     return notifications.filter((notification) => {
       const vendorName = getVendorName(notification).toLowerCase();
       const vendorEmail = getVendorEmail(notification).toLowerCase();
       const documentName =
         getDocumentName(notification).toLowerCase();
       const title = (notification.title || "").toLowerCase();
       const message =
         (notification.message || "").toLowerCase();
 
       return (
         vendorName.includes(value) ||
         vendorEmail.includes(value) ||
         documentName.includes(value) ||
         title.includes(value) ||
         message.includes(value)
       );
     });
   }, [notifications, search]);
 
   // =========================================================
   // REMINDER FILTER OPTIONS
   // =========================================================
 
   const reminderOptions = [
     {
       value: "ALL",
       label: "All Reminders",
     },
     {
       value: "15_DAY",
       label: "15 Days Before",
     },
     {
       value: "7_DAY",
       label: "7 Days Before",
     },
     {
       value: "1_DAY",
       label: "1 Day Before",
     },
     {
       value: "EXPIRED_1_DAY",
       label: "1 Day Expired",
     },
     {
       value: "EXPIRED_3_DAY",
       label: "3 Days Expired",
     },
     {
       value: "EXPIRED_7_DAY",
       label: "7 Days Expired",
     },
   ];
 
   // =========================================================
   // STATUS BADGE
   // =========================================================
 
   const StatusBadge = ({ status }) => {
     if (status === "SENT") {
       return (
         <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
           <CheckCircle2 size={14} />
           Sent
         </span>
       );
     }
 
     return (
       <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">
         <XCircle size={14} />
         Failed
       </span>
     );
   };
 
   // =========================================================
   // LOADING STATE
   // =========================================================
 
   if (loading) {
     return (
       <div className="min-h-full bg-slate-50 p-4 md:p-6 lg:p-8">
         <div className="mx-auto max-w-7xl">
           <div className="mb-8">
             <div className="h-8 w-72 animate-pulse rounded-lg bg-slate-200" />
 
             <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-slate-200" />
           </div>
 
           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
             {[1, 2, 3, 4].map((item) => (
               <div
                 key={item}
                 className="h-32 animate-pulse rounded-2xl bg-white shadow-sm"
               />
             ))}
           </div>
 
           <div className="mt-6 h-96 animate-pulse rounded-2xl bg-white shadow-sm" />
         </div>
       </div>
     );
   }
 
   // =========================================================
   // MAIN UI
   // =========================================================
 
   return (
     <div className="min-h-full bg-slate-50 p-4 md:p-6 lg:p-8">
       <div className="mx-auto max-w-7xl">
 
         {/* =====================================================
             SUCCESS MESSAGE
         ====================================================== */}
 
         {resendSuccess && (
           <div className="fixed right-5 top-5 z-[100] flex max-w-sm items-start gap-3 rounded-xl border border-emerald-200 bg-white px-4 py-3 shadow-xl">
             <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
               <CheckCircle2 size={19} />
             </div>
 
             <div className="flex-1">
               <p className="text-sm font-semibold text-slate-900">
                 Resend Successful
               </p>
 
               <p className="mt-0.5 text-xs text-slate-500">
                 {resendSuccess}
               </p>
             </div>
 
             <button
               type="button"
               onClick={() => setResendSuccess("")}
               className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
             >
               <X size={16} />
             </button>
           </div>
         )}
 
         {/* =====================================================
             FAILURE MESSAGE
         ====================================================== */}
 
         {resendError && (
           <div className="fixed right-5 top-5 z-[100] flex max-w-sm items-start gap-3 rounded-xl border border-red-200 bg-white px-4 py-3 shadow-xl">
             <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
               <XCircle size={19} />
             </div>
 
             <div className="flex-1">
               <p className="text-sm font-semibold text-slate-900">
                 Resend Failed
               </p>
 
               <p className="mt-0.5 text-xs text-slate-500">
                 {resendError}
               </p>
             </div>
 
             <button
               type="button"
               onClick={() => setResendError("")}
               className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
             >
               <X size={16} />
             </button>
           </div>
         )}
 
         {/* =====================================================
             HEADER
         ====================================================== */}
 
         <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
           <div>
             <div className="flex items-center gap-3">
               <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                 <Mail size={22} />
               </div>
 
               <div>
                 <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                   Email Delivery & Monitoring
                 </h1>
 
                 <p className="mt-1 text-sm text-slate-500">
                   Monitor expiry reminder emails and retry failed
                   deliveries.
                 </p>
               </div>
             </div>
           </div>
 
           <div className="flex flex-wrap items-center gap-3">
 
   {stats.sent > 0 && (
     <button
       type="button"
       onClick={() => setShowDeleteSentModal(true)}
       disabled={deletingSent}
       className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
     >
       <XCircle size={17} />
 
       Delete All Sent
     </button>
   )}
 
   <button
     type="button"
     onClick={handleRefresh}
     disabled={refreshing}
     className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
   >
     <RefreshCw
       size={17}
       className={refreshing ? "animate-spin" : ""}
     />
 
     {refreshing ? "Refreshing..." : "Refresh"}
   </button>
 
 </div>
         </div>
 
         {/* =====================================================
             ERROR
         ====================================================== */}
 
         {error && (
           <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
             <AlertCircle
               size={18}
               className="mt-0.5 shrink-0"
             />
 
             <div className="flex-1">
               <p className="font-semibold">
                 Something went wrong
               </p>
 
               <p className="mt-0.5 text-red-600">
                 {error}
               </p>
             </div>
 
             <button
               type="button"
               onClick={() => setError("")}
               className="rounded-lg p-1 text-red-500 hover:bg-red-100"
             >
               <X size={17} />
             </button>
           </div>
         )}
 
         {/* =====================================================
             SUMMARY CARDS
         ====================================================== */}
 
         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
 
           {/* Total */}
           <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-sm font-medium text-slate-500">
                   Total Emails
                 </p>
 
                 <p className="mt-2 text-3xl font-bold text-slate-900">
                   {stats.total}
                 </p>
               </div>
 
               <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                 <Mail size={21} />
               </div>
             </div>
 
             <p className="mt-3 text-xs text-slate-400">
               All expiry reminder records
             </p>
           </div>
 
           {/* Sent */}
           <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-sm font-medium text-slate-500">
                   Sent
                 </p>
 
                 <p className="mt-2 text-3xl font-bold text-emerald-600">
                   {stats.sent}
                 </p>
               </div>
 
               <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                 <CheckCircle2 size={21} />
               </div>
             </div>
 
             <p className="mt-3 text-xs text-slate-400">
               Successfully delivered to mail server
             </p>
           </div>
 
           {/* Failed */}
           <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-sm font-medium text-slate-500">
                   Failed
                 </p>
 
                 <p className="mt-2 text-3xl font-bold text-red-600">
                   {stats.failed}
                 </p>
               </div>
 
               <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                 <XCircle size={21} />
               </div>
             </div>
 
             <p className="mt-3 text-xs text-slate-400">
               Emails requiring attention
             </p>
           </div>
 
           {/* Unread */}
           <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-sm font-medium text-slate-500">
                   Unread
                 </p>
 
                 <p className="mt-2 text-3xl font-bold text-amber-600">
                   {stats.unread}
                 </p>
               </div>
 
               <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                 <Clock3 size={21} />
               </div>
             </div>
 
             <p className="mt-3 text-xs text-slate-400">
               Notifications not yet read
             </p>
           </div>
         </div>
 
         {/* =====================================================
             FILTER BAR
         ====================================================== */}
 
         <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
           <div className="flex flex-col gap-3 xl:flex-row">
 
             {/* Search */}
             <div className="relative flex-1">
               <Search
                 size={18}
                 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
               />
 
               <input
                 type="text"
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 placeholder="Search vendor, email, document..."
                 className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
               />
             </div>
 
             {/* Status */}
             <div className="relative min-w-[180px]">
               <Filter
                 size={16}
                 className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
               />
 
               <select
                 value={statusFilter}
                 onChange={(e) =>
                   setStatusFilter(e.target.value)
                 }
                 className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-8 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
               >
                 <option value="ALL">All Status</option>
                 <option value="SENT">Sent</option>
                 <option value="FAILED">Failed</option>
               </select>
             </div>
 
             {/* Reminder */}
             <div className="min-w-[210px]">
               <select
                 value={reminderFilter}
                 onChange={(e) =>
                   setReminderFilter(e.target.value)
                 }
                 className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
               >
                 {reminderOptions.map((option) => (
                   <option
                     key={option.value}
                     value={option.value}
                   >
                     {option.label}
                   </option>
                 ))}
               </select>
             </div>
 
             {/* Clear */}
             {(search ||
               statusFilter !== "ALL" ||
               reminderFilter !== "ALL") && (
               <button
                 type="button"
                 onClick={clearFilters}
                 className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
               >
                 <X size={16} />
                 Clear
               </button>
             )}
           </div>
         </div>
 
         {/* =====================================================
             TABLE
         ====================================================== */}
 
         <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
 
           {/* Table Header */}
           <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
             <div>
               <h2 className="font-semibold text-slate-900">
                 Email Delivery Records
               </h2>
 
               <p className="mt-1 text-xs text-slate-500">
                 {filteredNotifications.length} record
                 {filteredNotifications.length !== 1
                   ? "s"
                   : ""}{" "}
                 found
               </p>
             </div>
 
             {stats.failed > 0 && (
               <div className="hidden items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 sm:flex">
                 <AlertCircle size={15} />
 
                 {stats.failed} failed email
                 {stats.failed !== 1 ? "s" : ""}
               </div>
             )}
           </div>
 
           {/* Empty */}
           {filteredNotifications.length === 0 ? (
             <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
               <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                 <Mail size={28} />
               </div>
 
               <h3 className="mt-5 text-base font-semibold text-slate-800">
                 No email records found
               </h3>
 
               <p className="mt-2 max-w-md text-sm text-slate-500">
                 No email delivery records match your current
                 filters.
               </p>
 
               {(search ||
                 statusFilter !== "ALL" ||
                 reminderFilter !== "ALL") && (
                 <button
                   type="button"
                   onClick={clearFilters}
                   className="mt-4 text-sm font-semibold text-slate-800 underline underline-offset-4"
                 >
                   Clear filters
                 </button>
               )}
             </div>
           ) : (
             <div className="overflow-x-auto">
               <table className="w-full min-w-[1050px]">
                 <thead>
                   <tr className="border-b border-slate-200 bg-slate-50">
 
                     <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                       Status
                     </th>
 
                     <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                       Vendor
                     </th>
 
                     <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                       Document
                     </th>
 
                     <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                       Reminder
                     </th>
 
                     <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                       Attempts
                     </th>
 
                     <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                       Last Attempt
                     </th>
 
                     <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                       Action
                     </th>
                   </tr>
                 </thead>
 
                 <tbody>
                   {filteredNotifications.map((notification) => (
                     <tr
                       key={notification._id}
                       className="border-b border-slate-100 transition hover:bg-slate-50/70"
                     >
 
                       {/* Status */}
                       <td className="px-5 py-4">
                         <StatusBadge
                           status={notification.emailStatus}
                         />
                       </td>
 
                       {/* Vendor */}
                       <td className="px-5 py-4">
                         <div>
                           <p className="max-w-[190px] truncate text-sm font-semibold text-slate-800">
                             {getVendorName(notification)}
                           </p>
 
                           <p className="mt-1 max-w-[190px] truncate text-xs text-slate-500">
                             {getVendorEmail(notification)}
                           </p>
                         </div>
                       </td>
 
                       {/* Document */}
                       <td className="px-5 py-4">
                         <div>
                           <p className="max-w-[180px] truncate text-sm font-medium text-slate-700">
                             {getDocumentName(notification)}
                           </p>
 
                           {notification.documentId?.expiryDate && (
                             <p className="mt-1 text-xs text-slate-400">
                               Expiry:{" "}
                               {formatShortDate(
                                 notification.documentId
                                   .expiryDate
                               )}
                             </p>
                           )}
                         </div>
                       </td>
 
                       {/* Reminder */}
                       <td className="px-5 py-4">
                         <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                           {getReminderLabel(
                             notification.reminderType
                           )}
                         </span>
                       </td>
 
                       {/* Attempts */}
                       <td className="px-5 py-4">
                         <div>
                           <p className="text-sm font-semibold text-slate-700">
                             {notification.attemptCount || 0}/3
                           </p>
 
                           <p className="mt-1 text-xs text-slate-400">
                             {notification.resendCount || 0}{" "}
                             resend
                             {notification.resendCount === 1
                               ? ""
                               : "s"}
                           </p>
                         </div>
                       </td>
 
                       {/* Last Attempt */}
                       <td className="px-5 py-4">
                         <span className="text-xs text-slate-500">
                           {formatDate(
                             notification.lastAttemptAt
                           )}
                         </span>
                       </td>
 
                       {/* Action */}
                       <td className="px-5 py-4">
                         <div className="flex items-center justify-end gap-2">
 
                           {/* Details */}
                           <button
                             type="button"
                             onClick={() =>
                               handleViewDetails(notification)
                             }
                             className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                           >
                             <Eye size={15} />
                             Details
                           </button>
 
                           {/* Resend */}
                           {notification.emailStatus ===
                             "FAILED" && (
                             <button
                               type="button"
                               onClick={() =>
                                 handleResendClick(notification)
                               }
                               disabled={
                                 resendingId ===
                                 notification._id
                               }
                               className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                             >
                               <RefreshCw
                                 size={15}
                                 className={
                                   resendingId ===
                                   notification._id
                                     ? "animate-spin"
                                     : ""
                                 }
                               />
 
                               {resendingId ===
                               notification._id
                                 ? "Resending..."
                                 : "Resend"}
                             </button>
                           )}
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           )}
         </div>
       </div>
 
       {/* =======================================================
           DETAILS DRAWER
       ======================================================== */}
 
       {showDetails && selectedNotification && (
         <div className="fixed inset-0 z-50">
 
           {/* Overlay */}
           <div
             className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
             onClick={closeDetails}
           />
 
           {/* Drawer */}
           <div className="absolute right-0 top-0 flex h-full w-full max-w-lg flex-col bg-white shadow-2xl">
 
             {/* Drawer Header */}
             <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
               <div>
                 <h2 className="text-lg font-bold text-slate-900">
                   Email Details
                 </h2>
 
                 <p className="mt-1 text-xs text-slate-500">
                   Delivery information and retry history
                 </p>
               </div>
 
               <button
                 type="button"
                 onClick={closeDetails}
                 className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
               >
                 <X size={20} />
               </button>
             </div>
 
             {/* Drawer Content */}
             <div className="flex-1 overflow-y-auto px-6 py-6">
 
               {/* Status */}
               <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                 <div className="flex items-center justify-between">
                   <span className="text-sm font-medium text-slate-500">
                     Delivery Status
                   </span>
 
                   <StatusBadge
                     status={
                       selectedNotification.emailStatus
                     }
                   />
                 </div>
               </div>
 
               {/* Recipient */}
               <div className="mt-5">
                 <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                   Recipient
                 </p>
 
                 <div className="rounded-xl border border-slate-200 p-4">
                   <p className="text-sm font-semibold text-slate-800">
                     {getVendorName(selectedNotification)}
                   </p>
 
                   <p className="mt-1 break-all text-sm text-slate-500">
                     {getVendorEmail(selectedNotification)}
                   </p>
                 </div>
               </div>
 
               {/* Document */}
               <div className="mt-5">
                 <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                   Document
                 </p>
 
                 <div className="rounded-xl border border-slate-200 p-4">
                   <p className="text-sm font-semibold text-slate-800">
                     {getDocumentName(selectedNotification)}
                   </p>
 
                   <p className="mt-1 text-sm text-slate-500">
                     Reminder:{" "}
                     {getReminderLabel(
                       selectedNotification.reminderType
                     )}
                   </p>
 
                   {selectedNotification.documentId
                     ?.expiryDate && (
                     <p className="mt-1 text-sm text-slate-500">
                       Expiry Date:{" "}
                       {formatShortDate(
                         selectedNotification.documentId
                           .expiryDate
                       )}
                     </p>
                   )}
                 </div>
               </div>
 
               {/* Delivery Stats */}
               <div className="mt-5">
                 <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                   Delivery Information
                 </p>
 
                 <div className="grid grid-cols-2 gap-3">
 
                   {/* Attempts */}
                   <div className="rounded-xl border border-slate-200 p-4">
                     <p className="text-xs text-slate-400">
                       Attempts
                     </p>
 
                     <p className="mt-1 text-lg font-bold text-slate-800">
                       {selectedNotification.attemptCount ||
                         0}
                       /3
                     </p>
                   </div>
 
                   {/* Resend Count */}
                   <div className="rounded-xl border border-slate-200 p-4">
                     <p className="text-xs text-slate-400">
                       Resend Count
                     </p>
 
                     <p className="mt-1 text-lg font-bold text-slate-800">
                       {selectedNotification.resendCount ||
                         0}
                     </p>
                   </div>
 
                   {/* Last Attempt */}
                   <div className="rounded-xl border border-slate-200 p-4">
                     <p className="text-xs text-slate-400">
                       Last Attempt
                     </p>
 
                     <p className="mt-1 text-sm font-semibold text-slate-700">
                       {formatDate(
                         selectedNotification.lastAttemptAt
                       )}
                     </p>
                   </div>
 
                   {/* Sent At */}
                   <div className="rounded-xl border border-slate-200 p-4">
                     <p className="text-xs text-slate-400">
                       Sent At
                     </p>
 
                     <p className="mt-1 text-sm font-semibold text-slate-700">
                       {formatDate(
                         selectedNotification.emailSentAt
                       )}
                     </p>
                   </div>
                 </div>
               </div>
 
               {/* Message ID */}
               {selectedNotification.emailMessageId && (
                 <div className="mt-5">
                   <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                     Email Message ID
                   </p>
 
                   <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                     <p className="break-all font-mono text-xs text-slate-600">
                       {selectedNotification.emailMessageId}
                     </p>
                   </div>
                 </div>
               )}
 
               {/* Error */}
               {selectedNotification.emailStatus ===
                 "FAILED" &&
                 selectedNotification.emailError && (
                   <div className="mt-5">
                     <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-red-500">
                       Error
                     </p>
 
                     <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                       <div className="flex gap-3">
                         <AlertCircle
                           size={18}
                           className="mt-0.5 shrink-0 text-red-600"
                         />
 
                         <p className="break-words text-sm leading-6 text-red-700">
                           {selectedNotification.emailError}
                         </p>
                       </div>
                     </div>
                   </div>
                 )}
 
               {/* Email Subject */}
               <div className="mt-5">
                 <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                   Subject
                 </p>
 
                 <div className="rounded-xl border border-slate-200 p-4">
                   <p className="text-sm font-semibold text-slate-700">
                     {selectedNotification.title ||
                       "Expiry Reminder"}
                   </p>
                 </div>
               </div>
 
               {/* Email Message */}
               <div className="mt-5">
                 <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                   Message
                 </p>
 
                 <div className="whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                   {selectedNotification.message ||
                     "No message available."}
                 </div>
               </div>
 
               {/* Created */}
               <div className="mt-5 pb-6">
                 <p className="text-xs text-slate-400">
                   Notification created
                 </p>
 
                 <p className="mt-1 text-sm text-slate-600">
                   {formatDate(
                     selectedNotification.createdAt
                   )}
                 </p>
               </div>
             </div>
 
             {/* Drawer Footer */}
             {selectedNotification.emailStatus ===
               "FAILED" && (
               <div className="border-t border-slate-200 bg-white p-4">
                 <button
                   type="button"
                   onClick={() => {
                     setShowDetails(false);
                     handleResendClick(
                       selectedNotification
                     );
                   }}
                   disabled={
                     resendingId ===
                     selectedNotification._id
                   }
                   className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                 >
                   <Send size={17} />
 
                   {resendingId ===
                   selectedNotification._id
                     ? "Resending..."
                     : "Resend Email"}
                 </button>
               </div>
             )}
           </div>
         </div>
       )}
 
       {/* =======================================================
           RESEND CONFIRMATION MODAL
       ======================================================== */}
 
       {showResendModal && notificationToResend && (
         <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
 
           <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
 
             {/* Modal Header */}
             <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
               <div className="flex items-start gap-3">
                 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                   <RefreshCw size={19} />
                 </div>
 
                 <div>
                   <h3 className="font-bold text-slate-900">
                     Resend Email?
                   </h3>
 
                   <p className="mt-1 text-xs text-slate-500">
                     The same notification record will be
                     updated.
                   </p>
                 </div>
               </div>
 
               <button
                 type="button"
                 onClick={closeResendModal}
                 disabled={resendingId !== null}
                 className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
               >
                 <X size={18} />
               </button>
             </div>
 
             {/* Modal Content */}
             <div className="px-6 py-5">
 
               <div className="rounded-xl bg-slate-50 p-4">
                 <p className="text-sm font-semibold text-slate-800">
                   {getVendorName(notificationToResend)}
                 </p>
 
                 <p className="mt-1 break-all text-xs text-slate-500">
                   {getVendorEmail(notificationToResend)}
                 </p>
 
                 <div className="mt-3 border-t border-slate-200 pt-3">
                   <p className="text-xs text-slate-500">
                     {getDocumentName(notificationToResend)}
                   </p>
 
                   <p className="mt-1 text-xs font-medium text-slate-600">
                     {getReminderLabel(
                       notificationToResend.reminderType
                     )}
                   </p>
                 </div>
               </div>
 
               {/* Current Retry Information */}
               <div className="mt-4 grid grid-cols-2 gap-3">
 
                 <div className="rounded-xl border border-slate-200 p-3">
                   <p className="text-xs text-slate-400">
                     Previous Attempts
                   </p>
 
                   <p className="mt-1 text-lg font-bold text-slate-800">
                     {notificationToResend.attemptCount ||
                       0}
                     /3
                   </p>
                 </div>
 
                 <div className="rounded-xl border border-slate-200 p-3">
                   <p className="text-xs text-slate-400">
                     Previous Resends
                   </p>
 
                   <p className="mt-1 text-lg font-bold text-slate-800">
                     {notificationToResend.resendCount ||
                       0}
                   </p>
                 </div>
               </div>
 
               <div className="mt-4 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                 <AlertCircle
                   size={18}
                   className="mt-0.5 shrink-0 text-amber-600"
                 />
 
                 <p className="text-xs leading-5 text-amber-700">
                   The email service will attempt delivery up
                   to <strong>3 times</strong>. The resend
                   count will increase by 1.
                 </p>
               </div>
             </div>
 
             {/* Modal Footer */}
             <div className="flex gap-3 border-t border-slate-200 px-6 py-4">
 
               <button
                 type="button"
                 onClick={closeResendModal}
                 disabled={resendingId !== null}
                 className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
               >
                 Cancel
               </button>
 
               <button
                 type="button"
                 onClick={handleConfirmResend}
                 disabled={resendingId !== null}
                 className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
               >
                 <RefreshCw
                   size={16}
                   className={
                     resendingId !== null
                       ? "animate-spin"
                       : ""
                   }
                 />
 
                 {resendingId !== null
                   ? "Resending..."
                   : "Confirm Resend"}
               </button>
             </div>
           </div>
         </div>
       )}
       {deleteSuccess && (
   <div className="fixed right-5 top-5 z-[100] flex max-w-sm items-start gap-3 rounded-xl border border-emerald-200 bg-white px-4 py-3 shadow-xl">
     <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
       <CheckCircle2 size={19} />
     </div>
 
     <div className="flex-1">
       <p className="text-sm font-semibold text-slate-900">
         Delete Successful
       </p>
 
       <p className="mt-0.5 text-xs text-slate-500">
         {deleteSuccess}
       </p>
     </div>
 
     <button
       type="button"
       onClick={() => setDeleteSuccess("")}
       className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
     >
       <X size={16} />
     </button>
   </div>
 )}
 
 {deleteError && (
   <div className="fixed right-5 top-5 z-[100] flex max-w-sm items-start gap-3 rounded-xl border border-red-200 bg-white px-4 py-3 shadow-xl">
     <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
       <XCircle size={19} />
     </div>
 
     <div className="flex-1">
       <p className="text-sm font-semibold text-slate-900">
         Delete Failed
       </p>
 
       <p className="mt-0.5 text-xs text-slate-500">
         {deleteError}
       </p>
     </div>
 
     <button
       type="button"
       onClick={() => setDeleteError("")}
       className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
     >
       <X size={16} />
     </button>
   </div>
 )}
 
       {/* =======================================================
           DELETE SENT NOTIFICATIONS CONFIRMATION MODAL
       ======================================================== */}
 
       {showDeleteSentModal && (
         <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
           <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
             <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
               <div className="flex items-start gap-3">
                 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                   <XCircle size={20} />
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-900">
                     Delete Sent Notifications?
                   </h3>
                   <p className="mt-1 text-xs text-slate-500">
                     This action cannot be undone.
                   </p>
                 </div>
               </div>
 
               <button
                 type="button"
                 onClick={() => setShowDeleteSentModal(false)}
                 disabled={deletingSent}
                 className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
               >
                 <X size={18} />
               </button>
             </div>
 
             <div className="px-6 py-5">
               <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                 <div className="flex gap-3">
                   <AlertCircle
                     size={19}
                     className="mt-0.5 shrink-0 text-red-600"
                   />
                   <div>
                     <p className="text-sm font-semibold text-red-800">
                       {stats.sent} successfully sent notification
                       {stats.sent !== 1 ? "s" : ""}
                     </p>
                     <p className="mt-1 text-xs leading-5 text-red-700">
                       All successfully sent email notification records will
                       be permanently deleted from VendorVault.
                     </p>
                   </div>
                 </div>
               </div>
 
               <div className="mt-4 rounded-xl bg-slate-50 p-4">
                 <div className="flex items-center justify-between">
                   <span className="text-sm text-slate-500">
                     Sent Notifications
                   </span>
                   <span className="text-lg font-bold text-slate-900">
                     {stats.sent}
                   </span>
                 </div>
 
                 <div className="mt-3 border-t border-slate-200 pt-3">
                   <p className="text-xs text-slate-500">
                     Failed notifications will not be deleted and will remain
                     available for resend.
                   </p>
                 </div>
               </div>
             </div>
 
             <div className="flex gap-3 border-t border-slate-200 px-6 py-4">
               <button
                 type="button"
                 onClick={() => setShowDeleteSentModal(false)}
                 disabled={deletingSent}
                 className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
               >
                 Cancel
               </button>
 
               <button
                 type="button"
                 onClick={handleDeleteAllSent}
                 disabled={deletingSent || stats.sent === 0}
                 className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
               >
                 {deletingSent ? (
                   <>
                     <RefreshCw size={16} className="animate-spin" />
                     Deleting...
                   </>
                 ) : (
                   <>
                     <XCircle size={16} />
                     Delete All Sent
                   </>
                 )}
               </button>
             </div>
           </div>
         </div>
       )}
 
     </div>
   );
 };
 
 export default EmailDelivery;
  