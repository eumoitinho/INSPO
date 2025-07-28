/**
 * Chart utilities for dynamic data visualization
 * Creates chart configurations based on real data from MongoDB
 */

export const createAreaChartConfig = (data, labels, options = {}) => {
  return {
    series: [{
      name: options.name || "Data",
      data: data || []
    }],
    options: {
      chart: {
        height: options.height || 264,
        type: "area",
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
        dropShadow: {
          enabled: false,
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0,
          opacityTo: 0,
          stops: [0, 90, 100],
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        colors: [options.color || "#D00054"],
        width: 3,
      },
      markers: {
        size: 0,
        strokeWidth: 3,
        hover: {
          size: 8,
        },
      },
      tooltip: {
        enabled: true,
        x: {
          show: true,
        },
        y: {
          show: true,
        },
      },
      grid: {
        borderColor: "#D1D5DB",
        strokeDashArray: 3,
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return options.formatter ? options.formatter(value) : value;
          },
        },
      },
      xaxis: {
        categories: labels || [],
        labels: {
          style: {
            fontSize: "14px",
          },
        },
      },
    }
  };
};

export const createBarChartConfig = (data, labels, options = {}) => {
  return {
    series: [{
      name: options.name || "Data",
      data: data || []
    }],
    options: {
      chart: {
        height: options.height || 220,
        type: "bar",
        toolbar: {
          show: false,
        },
      },
      colors: [options.color || "#D00054"],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: labels || [],
      },
      yaxis: {
        title: {
          text: options.yAxisTitle || ''
        },
        labels: {
          formatter: function (value) {
            return options.formatter ? options.formatter(value) : value;
          },
        },
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return options.formatter ? options.formatter(val) : val;
          }
        }
      }
    }
  };
};

export const createPieChartConfig = (data, labels, options = {}) => {
  return {
    series: data || [],
    options: {
      chart: {
        width: options.width || 380,
        type: 'pie',
      },
      labels: labels || [],
      colors: options.colors || ['#D00054', '#487FFF', '#22C55E', '#F59E0B', '#EF4444'],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    }
  };
};

export const createLineChartConfig = (series, categories, options = {}) => {
  return {
    series: series || [],
    options: {
      chart: {
        height: options.height || 350,
        type: 'line',
        toolbar: {
          show: false,
        },
      },
      stroke: {
        width: 2,
        curve: 'smooth'
      },
      xaxis: {
        categories: categories || [],
        labels: {
          style: {
            fontSize: "14px",
          },
        },
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return options.formatter ? options.formatter(value) : value;
          },
        },
      },
      grid: {
        borderColor: "#D1D5DB",
        strokeDashArray: 3,
      },
      colors: options.colors || ['#D00054', '#487FFF', '#22C55E'],
      tooltip: {
        y: {
          formatter: function (val) {
            return options.formatter ? options.formatter(val) : val;
          }
        }
      }
    }
  };
};

// Helper function to format currency
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Helper function to format percentages
export const formatPercentage = (value) => {
  return `${value.toFixed(2)}%`;
};

// Helper function to format numbers
export const formatNumber = (value) => {
  return new Intl.NumberFormat('pt-BR').format(value);
};

// Helper function to process campaign data for charts
export const processCampaignDataForChart = (campaigns, metric = 'cost') => {
  const processedData = campaigns.map(campaign => {
    const latestMetric = campaign.metrics?.[campaign.metrics.length - 1];
    return {
      name: campaign.campaignName,
      value: latestMetric?.[metric] || 0,
      date: campaign.date
    };
  });
  
  return {
    data: processedData.map(item => item.value),
    labels: processedData.map(item => item.name),
    series: processedData
  };
};

// Helper function to aggregate data by date
export const aggregateDataByDate = (campaigns, metric = 'cost') => {
  const dateMap = new Map();
  
  campaigns.forEach(campaign => {
    if (campaign.metrics) {
      campaign.metrics.forEach(metricData => {
        const date = new Date(metricData.date).toLocaleDateString('pt-BR');
        const currentValue = dateMap.get(date) || 0;
        dateMap.set(date, currentValue + (metricData[metric] || 0));
      });
    }
  });
  
  const sortedEntries = Array.from(dateMap.entries()).sort((a, b) => new Date(a[0]) - new Date(b[0]));
  
  return {
    labels: sortedEntries.map(([date]) => date),
    data: sortedEntries.map(([, value]) => value)
  };
};