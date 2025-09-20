import React, { useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Download, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CertificateProps {
  moduleName: string;
  completionDate: string;
  totalLessons: number;
  totalTimeSpent: number;
}

const CertificateGenerator: React.FC<CertificateProps> = ({
  moduleName,
  completionDate,
  totalLessons,
  totalTimeSpent
}) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const certificateRef = useRef<HTMLDivElement>(null);

  const downloadCertificate = () => {
    if (!certificateRef.current) return;

    // Create a canvas to render the certificate
    import('html2canvas').then((html2canvas) => {
      html2canvas.default(certificateRef.current!, {
        scale: 2,
        backgroundColor: '#ffffff',
        width: 800,
        height: 600
      }).then((canvas) => {
        const link = document.createElement('a');
        link.download = `${moduleName}_Certificate_${profile?.first_name || 'Student'}.png`;
        link.href = canvas.toDataURL();
        link.click();
        
        toast({
          title: "Certificate Downloaded! 🎉",
          description: "Your certificate has been saved to your device.",
        });
      });
    }).catch(() => {
      toast({
        title: "Download Failed",
        description: "Unable to download certificate. Please try again.",
        variant: "destructive"
      });
    });
  };

  const shareCertificate = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${moduleName} Completion Certificate`,
          text: `I just completed the ${moduleName} module on Learn1on1! 🎉`,
          url: window.location.origin
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `I just completed the ${moduleName} module on Learn1on1! 🎉 ${window.location.origin}`
      );
      toast({
        title: "Copied to Clipboard",
        description: "Certificate message copied to clipboard!",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Certificate Display */}
      <Card className="overflow-hidden">
        <div
          ref={certificateRef}
          className="relative p-12 bg-gradient-to-br from-blue-50 via-white to-blue-50 border-8 border-blue-200"
          style={{ minHeight: '600px', width: '800px', margin: '0 auto' }}
        >
          {/* Decorative Border */}
          <div className="absolute inset-4 border-4 border-blue-300 rounded-lg opacity-30"></div>
          
          {/* Content */}
          <div className="relative z-10 text-center space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <Award className="w-16 h-16 mx-auto text-blue-600" />
              <h1 className="text-4xl font-bold text-blue-900">
                Certificate of Completion
              </h1>
              <div className="w-32 h-1 bg-blue-400 mx-auto rounded"></div>
            </div>

            {/* Main Content */}
            <div className="space-y-6">
              <p className="text-lg text-gray-700">
                This certifies that
              </p>
              
              <h2 className="text-3xl font-bold text-blue-900 border-b-2 border-blue-300 inline-block px-6 pb-2">
                {profile?.first_name && profile?.last_name 
                  ? `${profile.first_name} ${profile.last_name}`
                  : profile?.first_name || 'Student'}
              </h2>
              
              <p className="text-lg text-gray-700">
                has successfully completed the
              </p>
              
              <h3 className="text-2xl font-bold text-blue-800">
                {moduleName}
              </h3>
              
              <div className="grid grid-cols-2 gap-8 mt-8 text-sm">
                <div>
                  <p className="text-gray-600">Completion Date</p>
                  <p className="font-semibold text-blue-900">{formatDate(completionDate)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Lessons Completed</p>
                  <p className="font-semibold text-blue-900">{totalLessons} Lessons</p>
                </div>
                <div>
                  <p className="text-gray-600">Time Invested</p>
                  <p className="font-semibold text-blue-900">{formatTime(totalTimeSpent)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Issued By</p>
                  <p className="font-semibold text-blue-900">Learn1on1</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-8">
              <div className="flex justify-center items-center space-x-8">
                <div className="text-center">
                  <div className="w-40 h-0.5 bg-blue-300 mb-2"></div>
                  <p className="text-sm text-gray-600">Instructor Signature</p>
                </div>
                <div className="text-center">
                  <div className="w-40 h-0.5 bg-blue-300 mb-2"></div>
                  <p className="text-sm text-gray-600">Date Issued</p>
                  <p className="text-xs text-gray-500">{formatDate(completionDate)}</p>
                </div>
              </div>
            </div>

            {/* Certificate ID */}
            <p className="text-xs text-gray-400 mt-8">
              Certificate ID: {user?.id?.slice(0, 8)}-{Date.now().toString(36)}
            </p>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={downloadCertificate}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download Certificate
        </Button>
        <Button
          variant="outline"
          onClick={shareCertificate}
          className="flex items-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          Share Achievement
        </Button>
      </div>
    </div>
  );
};

export default CertificateGenerator;