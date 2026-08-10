import { Text, View } from 'react-native';
import { Card } from './Card';
import { Avatar } from '@/components/ui/Avatar';
import { RatingStars } from '@/components/ui/RatingStars';
import { timeAgo } from '@/utils/format';
import type { Review } from '@/types/review';
import { cn } from '@/utils/cn';

interface ReviewCardProps {
  review: Review;
  className?: string;
}

export function ReviewCard({ review, className }: ReviewCardProps) {
  return (
    <Card className={cn('p-4', className)}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2.5">
          <Avatar name={review.authorName} size="sm" />
          <View>
            <Text className="text-[14px] font-bold text-ink">{review.authorName}</Text>
            <Text className="text-[11px] text-ink-muted">{timeAgo(review.date)}</Text>
          </View>
        </View>
        <RatingStars value={review.rating} size={13} />
      </View>
      <Text className="mt-3 text-[14px] leading-5 text-ink-secondary">{review.comment}</Text>
    </Card>
  );
}
