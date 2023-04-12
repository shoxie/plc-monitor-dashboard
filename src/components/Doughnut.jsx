import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
  labels: ["Red"],
  datasets: [
    {
      label: "# of Votes",
      data: [3],
      backgroundColor: ["rgba(255, 99, 132, 0.2)"],
      borderColor: ["rgba(255, 99, 132, 1)"],
      borderWidth: 1,
    },
  ],
};

export function DoughnutReader() {
  return (
    <Doughnut
      data={data}
      options={{
        plugins: [
          {
            id: "my-doughnut-text-plugin",
            afterDraw: function (chart, option) {
              let theCenterText = "50%";
              const canvasBounds = canvas.getBoundingClientRect();
              const fontSz = Math.floor(canvasBounds.height * 0.1);
              chart.ctx.textBaseline = "middle";
              chart.ctx.textAlign = "center";
              chart.ctx.font = fontSz + "px Arial";
              chart.ctx.fillText(
                theCenterText,
                canvasBounds.width / 2,
                canvasBounds.height * 0.7
              );
            },
          },
        ],
      }}
    />
  );
}
