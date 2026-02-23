import React from 'react';
import { HelpCircle, Mail, MessageCircle } from 'lucide-react';

const StudentHelp = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-800">How can we help you?</h1>
                <p className="text-gray-500 mt-2">Search our help center or contact support</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <HelpCircle size={24} />
                    </div>
                    <h3 className="font-bold text-gray-800">FAQs</h3>
                    <p className="text-sm text-gray-500 mt-2">Find answers to common questions</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail size={24} />
                    </div>
                    <h3 className="font-bold text-gray-800">Email Support</h3>
                    <p className="text-sm text-gray-500 mt-2">Get help via email</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle size={24} />
                    </div>
                    <h3 className="font-bold text-gray-800">Live Chat</h3>
                    <p className="text-sm text-gray-500 mt-2">Chat with our support team</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <details className="group">
                        <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                            <span>How do I submit an assignment?</span>
                            <span className="transition group-open:rotate-180">
                                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                            </span>
                        </summary>
                        <p className="text-gray-500 mt-3 group-open:animate-fadeIn">
                            Go to the Courses page, select your course, find the assignment in the list, and click "Submit Assignment" to upload your file.
                        </p>
                    </details>
                    <div className="border-t border-gray-100 my-2"></div>
                    <details className="group">
                        <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                            <span>Where can I see my grades?</span>
                            <span className="transition group-open:rotate-180">
                                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                            </span>
                        </summary>
                        <p className="text-gray-500 mt-3 group-open:animate-fadeIn">
                            Check the "Assignments" widget on your dashboard or navigate to the specific course. Graded assignments will show the score and feedback.
                        </p>
                    </details>
                </div>
            </div>
        </div>
    );
};

export default StudentHelp;
