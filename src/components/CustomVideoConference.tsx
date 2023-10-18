import { isEqualTrackRef, type TrackReferenceOrPlaceholder } from '@livekit/components-core';
import {
  CarouselLayout,
  ConnectionStateToast,
  FocusLayout,
  FocusLayoutContainer,
  GridLayout,
  ParticipantTile,
  useTracks,
} from '@livekit/components-react';
import { Track } from 'livekit-client';

const CustomVideoConference = ({ focusTrack }: { focusTrack: TrackReferenceOrPlaceholder }) => {
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
    { source: Track.Source.ScreenShare, withPlaceholder: false },
  ]).filter((track) => track.participant.permissions?.canSubscribe);

  const subscribedTracks = tracks.filter((track) => track.participant.permissions?.canSubscribe);
  const carouselTracks = subscribedTracks.filter((track) => !isEqualTrackRef(track, focusTrack));

  return (
    <div className="h-full">
      {focusTrack ? (
        <FocusLayoutContainer className="h-full max-h-[100vh!important] grid-rows-[1fr_4fr] grid-cols-[100%!important]">
          <CarouselLayout tracks={carouselTracks} orientation="horizontal">
            <ParticipantTile />
          </CarouselLayout>
          <FocusLayout trackRef={focusTrack} />
        </FocusLayoutContainer>
      ) : (
        <GridLayout tracks={tracks} className="h-full max-h-[100vh!important]">
          <ParticipantTile />
        </GridLayout>
      )}
      <ConnectionStateToast />
    </div>
  );
};

export default CustomVideoConference;
