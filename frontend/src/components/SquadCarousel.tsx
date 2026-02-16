import React from 'react';
import styled from 'styled-components';
import { MatchRequest } from '@/context/UserContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X, MapPin, Target, Trophy } from 'lucide-react';

interface SquadCarouselProps {
  requests: MatchRequest[];
  onApprove: (id: string, name: string) => void;
  onReject: (id: string, name: string) => void;
}

const SquadCarousel: React.FC<SquadCarouselProps> = ({ requests, onApprove, onReject }) => {
  const quantity = requests.length;

  if (quantity === 0) return null;

  return (
    <StyledWrapper $quantity={quantity}>
      <div className="wrapper">
        <div className="inner" style={{ '--quantity': quantity } as React.CSSProperties}>
          {requests.map((req, index) => (
            <div
              key={req.id}
              className="card"
              style={{
                '--index': index,
                '--color-card': index % 2 === 0 ? 'var(--primary)' : 'var(--secondary)'
              } as React.CSSProperties}
            >
              <div className="card-content">
                {/* Header Decoration */}
                <div className="card-glare" />
                <div className="card-neon-border" />

                <div className="main-info">
                  <div className="avatar-container">
                    <Avatar className="h-24 w-24 border-4 border-[#050a0d] ring-2 ring-primary shadow-[0_0_20px_rgba(var(--primary),0.3)]">
                      <AvatarImage src={req.playerAvatar} className="object-cover" />
                      <AvatarFallback className="bg-primary/20 text-primary font-black uppercase">
                        {req.playerName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="sport-badge">
                      <Trophy size={12} className="text-primary-foreground" />
                    </div>
                  </div>

                  <div className="text-details">
                    <h4 className="player-name">{req.playerName}</h4>
                    <div className="sport-tag">{req.sport.toUpperCase()}</div>
                  </div>
                </div>

                <div className="tactical-stats">
                  <div className="t-stat">
                    <span className="t-label">LEVEL</span>
                    <span className="t-val">{req.experience.toUpperCase()}</span>
                  </div>
                  <div className="t-stat">
                    <span className="t-label">LOCATION</span>
                    <div className="location-flex">
                      <MapPin size={10} className="text-primary/60" />
                      <span className="t-val truncate">{req.turfName}</span>
                    </div>
                  </div>
                </div>

                <div className="actions">
                  <button
                    type="button"
                    className="btn-reject"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Reject clicked for:", req.id);
                      onReject(req.id, req.playerName);
                    }}
                  >
                    <X size={18} />
                    <span className="btn-text">DECLINE</span>
                  </button>
                  <button
                    type="button"
                    className="btn-approve"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Approve clicked for:", req.id);
                      onApprove(req.id, req.playerName);
                    }}
                  >
                    <Check size={18} />
                    <span className="btn-text">APPROVE</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div<{ $quantity: number }>`
  height: 850px;
  width: 100%;
  perspective: 2000px;
  
  .wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .inner {
    --w: 260px;
    --h: 340px;
    /* DYNAMIC RADIUS BASED ON QUANTITY - Keeps it compact */
    --translateZ: ${props => Math.max(250, props.$quantity * 65)}px;
    --rotateX: -10deg;
    --perspective: 1500px;
    position: absolute;
    width: var(--w);
    height: var(--h);
    transform-style: preserve-3d;
    animation: rotating 25s linear infinite;
    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .inner:hover {
    animation-play-state: paused;
  }

  @keyframes rotating {
    from {
      transform: rotateX(var(--rotateX)) rotateY(0);
    }
    to {
      transform: rotateX(var(--rotateX)) rotateY(1turn);
    }
  }

  .card {
    position: absolute;
    background: #050a0d;
    border-radius: 30px;
    /* Removed overflow: hidden to allow 3D children to pop out and be clickable */
    inset: 0;
    transform: rotateY(calc((360deg / var(--quantity)) * var(--index)))
      translateZ(var(--translateZ));
    backface-visibility: hidden;
    transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s ease;
    border: 1px solid rgba(255,255,255,0.05);
    transform-style: preserve-3d; /* CRITICAL for translateZ on children to work */
  }

  .card:hover {
    transform: rotateY(calc((360deg / var(--quantity)) * var(--index)))
      translateZ(calc(var(--translateZ) + 40px)) scale(1.05);
    box-shadow: 0 0 50px rgba(var(--primary), 0.2);
    border-color: hsl(var(--primary) / 0.3);
    z-index: 50;
  }

  .card-content {
    width: 100%;
    height: 100%;
    padding: 30px 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    transform-style: preserve-3d;
  }

  .card-glare {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%);
    pointer-events: none;
    z-index: 1;
  }

  .main-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    z-index: 10;
    pointer-events: none;
  }

  .avatar-container {
    position: relative;
  }

  .sport-badge {
    position: absolute;
    bottom: 2px;
    right: 2px;
    background: hsl(var(--primary));
    padding: 6px;
    border-radius: 10px;
    border: 3px solid #050a0d;
    box-shadow: 0 5px 10px rgba(0,0,0,0.3);
  }

  .text-details {
    text-align: center;
  }

  .player-name {
    font-size: 22px;
    font-weight: 900;
    font-style: italic;
    text-transform: uppercase;
    color: white;
    letter-spacing: -0.04em;
    line-height: 1;
    margin-bottom: 8px;
  }

  .sport-tag {
    font-size: 10px;
    font-weight: 900;
    color: hsl(var(--primary));
    letter-spacing: 0.3em;
    opacity: 0.8;
  }

  .tactical-stats {
    display: flex;
    flex-direction: column;
    gap: 12px;
    z-index: 10;
    pointer-events: none;
  }

  .t-stat {
    background: rgba(255,255,255,0.03);
    padding: 12px 16px;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.05);
  }

  .t-label {
    font-size: 8px;
    font-weight: 900;
    color: #555;
    letter-spacing: 0.1em;
    margin-bottom: 4px;
    display: block;
  }

  .t-val {
    font-size: 12px;
    font-weight: 800;
    color: #eee;
    display: block;
  }

  .location-flex {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .actions {
    display: flex;
    gap: 12px;
    z-index: 1000;
    margin-top: 10px;
    position: relative;
    pointer-events: auto !important;
    transform: translateZ(30px); /* Physically move buttons closer in 3D */
    transform-style: preserve-3d;
  }

  .btn-approve, .btn-reject {
    flex: 1;
    height: 48px;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(10, 15, 20, 0.8);
    position: relative;
    pointer-events: auto;
    box-shadow: 0 10px 20px rgba(0,0,0,0.4);
  }

  .btn-text {
    font-size: 7px;
    font-weight: 900;
    margin-top: 4px;
    letter-spacing: 0.1em;
  }

  .btn-approve {
    background: hsl(var(--primary) / 0.1);
    color: hsl(var(--primary));
  }
  
  .btn-approve:hover {
    background: hsl(var(--primary));
    color: #000;
    transform: translateY(-5px);
    box-shadow: 0 10px 20px hsl(var(--primary) / 0.4);
  }

  .btn-reject {
    background: rgba(255, 68, 68, 0.1);
    color: #ff4444;
  }
  
  .btn-reject:hover {
    background: #ff4444;
    color: white;
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(255, 68, 68, 0.4);
  }
`;

export default SquadCarousel;
