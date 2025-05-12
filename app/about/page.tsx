import React from 'react'

export default function AboutPage() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-playfair text-3xl font-bold tracking-tight mb-6 text-center">
          About Bar u Beci
        </h1>

        <div className="prose prose-lg max-w-none dark:prose-invert mx-auto">
          <p>
            Nestled in the heart of the city, Bar u Beci is a cozy, family-owned
            establishment that has been serving delicious home-cooked meals
            since 2010. Our name, which translates to &quot;Bar in the
            Cellar,&quot; reflects our charming basement location with exposed
            brick walls and a warm, inviting atmosphere.
          </p>

          <p>
            At Bar u Beci, we take pride in preparing authentic dishes using
            locally sourced, fresh ingredients. Our menu changes with the
            seasons, ensuring that we always offer the best flavors available.
            From hearty Czech classics to innovative modern creations, our
            passionate chefs pour their heart and soul into every dish.
          </p>

          <h2 className="font-playfair text-2xl font-bold tracking-tight mt-8 mb-4">
            Our Philosophy
          </h2>

          <p>
            We believe that good food brings people together. That&apos;s why
            we&apos;ve created a welcoming space where friends and family can
            gather to enjoy delicious meals, engage in meaningful conversations,
            and create lasting memories. Our commitment to quality,
            authenticity, and hospitality drives everything we do.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M12 20v-8"></path>
                  <path d="M18 20V9.5a2.5 2.5 0 0 0-5 0V20"></path>
                  <path d="M6 20v-3"></path>
                  <path d="M18 16c-.5-1.5-2-2-3-2h-1a3 3 0 0 1-3-3V8.5A2.5 2.5 0 0 0 8.5 6H8"></path>
                </svg>
              </div>
              <h3 className="font-medium">Local Ingredients</h3>
              <p className="text-sm text-muted-foreground">
                We source our ingredients from local farmers and suppliers.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M15 11h.01"></path>
                  <path d="M11 15h.01"></path>
                  <path d="M16 16h.01"></path>
                  <path d="m2 16 20 6-6-20A20 20 0 0 0 2 16"></path>
                  <path d="M5.71 17.11a17.04 17.04 0 0 1 11.4-11.4"></path>
                </svg>
              </div>
              <h3 className="font-medium">Authentic Recipes</h3>
              <p className="text-sm text-muted-foreground">
                Traditional dishes made with modern techniques.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1H8.3Z"></path>
                  <circle cx="12" cy="16" r="5"></circle>
                </svg>
              </div>
              <h3 className="font-medium">Warm Atmosphere</h3>
              <p className="text-sm text-muted-foreground">
                A cozy environment that feels like home.
              </p>
            </div>
          </div>

          <h2 className="font-playfair text-2xl font-bold tracking-tight mt-8 mb-4">
            Visit Us
          </h2>

          <p>
            We&apos;re located at 123 Cafe Street in the historic district. Our
            doors are open every day from 8:00 AM to 10:00 PM (11:00 PM on
            weekends). Whether you&apos;re stopping by for a quick breakfast, a
            leisurely lunch, or a romantic dinner, we look forward to serving
            you and making your dining experience memorable.
          </p>

          <p>
            For reservations or inquiries, feel free to contact us at +420 123
            456 789.
          </p>
        </div>
      </div>
    </div>
  );
}