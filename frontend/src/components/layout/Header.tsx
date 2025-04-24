import React from 'react';
import { Button } from '../ui/button';

interface HeaderProps {
  loading: boolean;
  simResult: string[];
  onGenerateSample: () => void;
  onSimulateCardUpdate: () => void;
}

const Header: React.FC<HeaderProps> = ({
  loading,
  simResult,
  onGenerateSample,
  onSimulateCardUpdate,
}) => {
  return (
    <header className="p-4 border-b">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">PayTrackr</h1>
          <p className="text-muted-foreground">Transaction Notification & Categorization Tool</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={onGenerateSample} disabled={loading}>Generate Sample Data</Button>
          <Button onClick={onSimulateCardUpdate} disabled={loading}>Simulate Card Update</Button>
        </div>
      </div>
      {simResult.length > 0 && (
        <div className="mt-3 p-3 bg-yellow-100 rounded">
          <strong>Merchants needing card update:</strong>
          <ul className="list-disc ml-6">
            {simResult.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header; 