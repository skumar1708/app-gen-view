// pages/preview/[previewId].js
import { useRouter } from 'next/router';
import Iframe from 'react-iframe';
import { useEffect, useState } from 'react';

function PreviewPage() {
  const router = useRouter();
  const { previewId } = router.query;
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (previewId) {
      setPreviewUrl(`http://localhost:5000`); // or your preview url.
    }
  }, [previewId]);

  if (!previewUrl) {
    return <div>Loading preview...</div>;
  }

  return <Iframe url={previewUrl} width="100%" height="100vh" />;
}

export default PreviewPage;