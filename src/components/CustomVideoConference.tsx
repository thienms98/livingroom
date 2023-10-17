import { isEqualTrackRef } from '@livekit/components-core';
import {
  CarouselLayout,
  ControlBar,
  FocusLayout,
  FocusLayoutContainer,
  GridLayout,
  ParticipantTile,
  useCreateLayoutContext,
  usePinnedTracks,
  useTracks,
} from '@livekit/components-react';
import { Track } from 'livekit-client';

const CustomVideoConference = () => {
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
    { source: Track.Source.ScreenShare, withPlaceholder: false },
  ]);

  const layoutContext = useCreateLayoutContext();
  const [focusTrack] = usePinnedTracks(layoutContext);
  console.log(usePinnedTracks(layoutContext));

  const carouselTracks = tracks.filter((track) => !isEqualTrackRef(track, focusTrack));

  return (
    <div className="h-full grid grid-rows-[auto_var(--lk-control-bar-height)]">
      {focusTrack ? (
        <FocusLayoutContainer>
          <CarouselLayout tracks={carouselTracks}>
            <ParticipantTile />
          </CarouselLayout>
          <FocusLayout trackRef={focusTrack} />
        </FocusLayoutContainer>
      ) : (
        <GridLayout tracks={tracks} className="max-h-full">
          <ParticipantTile />
        </GridLayout>
      )}
      <ControlBar />
    </div>
  );
};

export default CustomVideoConference;
