#include <sys/time.h>

int main(){
	timeval time;
	gettimeofday(&time, NULL);
	long millis = (time.tv_sec * 1000) + (time.tv_usec / 1000);

	return millis;
}